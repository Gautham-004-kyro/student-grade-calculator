from django.urls import path
from . import views

urlpatterns = [

    path('register/', views.register),

    path('login/', views.api_login),

    path('logout/', views.api_logout),

    path('check-auth/', views.check_auth),

    path('calculate/', views.calculate),

    path('students/', views.all_students),

    path('send-otp/', views.send_otp),

    path('verify-otp/', views.verify_otp),

    path('delete-student/<int:student_id>/', views.delete_student),

    path("update-student/<int:id>/",views.update_student),

    path("check-username/<str:username>/",views.check_username),

]