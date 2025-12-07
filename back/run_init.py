#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

# Importer et exécuter init_data
exec(open('init_data.py', encoding='utf-8').read())
