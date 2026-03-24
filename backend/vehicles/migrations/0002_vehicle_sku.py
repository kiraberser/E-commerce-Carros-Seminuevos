from django.db import migrations, models


def generate_skus(apps, schema_editor):
    Vehicle = apps.get_model('vehicles', 'Vehicle')
    trans_map = {'manual': 'M', 'automatic': 'A', 'cvt': 'C'}
    for v in Vehicle.objects.all():
        make_part = ''.join(c for c in (v.make or 'XXX') if c.isalpha())[:3].upper()
        trans_part = trans_map.get(v.transmission or '', 'X')
        v.sku = f'MG-{v.year}-{make_part}-{trans_part}-{v.pk:04d}'
        Vehicle.objects.filter(pk=v.pk).update(sku=v.sku)


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='vehicle',
            name='sku',
            field=models.CharField(blank=True, db_index=True, max_length=30, null=True, unique=True),
        ),
        migrations.RunPython(generate_skus, migrations.RunPython.noop),
    ]
