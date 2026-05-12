from django.urls import path
from . import views

urlpatterns = [

    path('api/register/', views.register),

    path('api/login/', views.api_login),

    path('api/logout/', views.api_logout),

    path('api/check-auth/', views.check_auth),

    path('api/calculate/', views.calculate),

    path('api/students/', views.all_students),

    path('api/send-otp/', views.send_otp),

    path('api/verify-otp/', views.verify_otp),

    path('api/delete-student/<int:student_id>/', views.delete_student),

    path("api/update-student/<int:id>/",views.update_student,),

]