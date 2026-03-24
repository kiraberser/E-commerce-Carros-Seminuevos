from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0002_vehicle_sku'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vehicleimage',
            name='image',
            field=models.URLField(max_length=500),
        ),
    ]
