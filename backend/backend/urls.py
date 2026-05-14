from django.http import HttpResponse
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', lambda request: HttpResponse("Backend is running successfully")),
    path('api/', include('myapp.urls')),
]