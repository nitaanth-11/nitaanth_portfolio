import os
import sys

# Add project root directory to sys.path so server.py can be cleanly imported
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from server import app

# Vercel WSGI entry point
# The Flask 'app' object is automatically detected by @vercel/python
