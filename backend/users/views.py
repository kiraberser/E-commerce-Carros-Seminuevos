from django.conf import settings
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

REFRESH_COOKIE_NAME = 'refresh_token'
REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60  # 7 days in seconds


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        samesite=getattr(settings, 'REFRESH_TOKEN_COOKIE_SAMESITE', 'Lax'),
        secure=getattr(settings, 'REFRESH_TOKEN_COOKIE_SECURE', False),
        max_age=REFRESH_COOKIE_MAX_AGE,
        path='/api/auth/',
    )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response = Response(
            {
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )
        _set_refresh_cookie(response, str(refresh))
        return response


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        response = Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
        })
        _set_refresh_cookie(response, str(refresh))
        return response


class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token_str = request.COOKIES.get(REFRESH_COOKIE_NAME)
        if not token_str:
            return Response({'detail': 'Refresh token not found.'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(token_str)
            access = str(refresh.access_token)
            response = Response({'access': access})
            # Rotate: set new refresh cookie
            _set_refresh_cookie(response, str(refresh))
            return response
        except Exception:
            return Response({'detail': 'Invalid or expired refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({'detail': 'Logged out successfully.'})
        response.delete_cookie(REFRESH_COOKIE_NAME, path='/api/auth/')
        return response


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
