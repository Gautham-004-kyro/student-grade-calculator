from urllib import request
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Student
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate, login, logout
from django.forms.models import model_to_dict
from django.core.mail import send_mail
import random
from django.conf import settings

@csrf_exempt
def register(request):

    if request.method == 'POST':

        data = json.loads(request.body)

        username = data.get('username')

        email = data.get('email')

        password = data.get('password')



        if User.objects.filter(username=username).exists():

            return JsonResponse({
                "error": "Username already exists"
            }, status=400)



        User.objects.create_user(

            username=username,

            email=email,

            password=password
        )



        return JsonResponse({
            "message": "Account created successfully"
        })



    return JsonResponse({
        "error": "Only POST method allowed"
    }, status=405)


@csrf_exempt
def api_login(request):

    if request.method == 'POST':

        data = json.loads(request.body)

        username = data.get('username')
        password = data.get('password')

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:

            login(request, user)

            return JsonResponse({
                "message": "Login successful"
            })

        else:
            return JsonResponse({
                "error": "Invalid credentials"
            }, status=400)

    return JsonResponse({
        "error": "Only POST method allowed"
    }, status=405)


otp_storage = {}

@csrf_exempt
def send_otp(request):
    try:
        if request.method != 'POST':
            return JsonResponse({
                "error": "Only POST allowed"
            }, status=405)

        data = json.loads(request.body)
        email = data.get('email')
        if not email:
            return JsonResponse({
                "error": "Email is required"
            }, status=400)

        otp = str(random.randint(100000, 999999))
        otp_storage[email] = otp

        try:
            send_mail(
                'OTP Code',
                f'Your OTP is {otp}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
        except Exception as exc:
            return JsonResponse({
                "error": "Unable to send OTP",
                "details": str(exc),
            }, status=500)

        return JsonResponse({
            "message": "OTP sent successfully"
        })
    except Exception as exc:
        return JsonResponse({
            "error": "Server error",
            "details": str(exc),
        }, status=500)
@csrf_exempt
def verify_otp(request):

    if request.method == 'POST':

        data = json.loads(request.body)

        email = data.get('email')

        otp = data.get('otp')

        if otp_storage.get(email) == otp:

            return JsonResponse({
                "verified": True
            })

        return JsonResponse({
            "verified": False
        })

    return JsonResponse({
        "error": "Only POST allowed"
    })


@csrf_exempt
def api_logout(request):
    logout(request)
    return JsonResponse({
        "message": "Logged out successfully"
    })

def check_auth(request):

    if request.user.is_authenticated:

        return JsonResponse({
            "authenticated": True,
            "username": request.user.username
        })

    return JsonResponse({
        "authenticated": False
    })



def all_students(request):

    students = Student.objects.all()

    data = []

    for student in students:

        data.append({

            "id": student.id,

            "name": student.name,

            "subject1": student.subject1,
            "subject2": student.subject2,
            "subject3": student.subject3,
            "subject4": student.subject4,
            "subject5": student.subject5,

            "total": student.total,

            "percentage": student.percentage,

            "grade": student.grade,

            "status": student.status,
        })

    return JsonResponse(data, safe=False)

@csrf_exempt
def update_student(request, id):

    if request.method == "PUT":

        try:

            student = Student.objects.get(id=id)

            data = json.loads(request.body)



            student.name = data.get("name")

            student.subject1 = data.get("subject1")

            student.subject2 = data.get("subject2")

            student.subject3 = data.get("subject3")

            student.subject4 = data.get("subject4")

            student.subject5 = data.get("subject5")



            total = (

                student.subject1 +
                student.subject2 +
                student.subject3 +
                student.subject4 +
                student.subject5

            )



            percentage = total / 5



            if percentage >= 90:
                grade = "A"

            elif percentage >= 75:
                grade = "B"

            elif percentage >= 60:
                grade = "C"

            elif percentage >= 50:
                grade = "D"

            else:
                grade = "F"



            status = (
                "Pass"
                if percentage >= 50
                else "Fail"
            )



            student.total = total

            student.percentage = percentage

            student.grade = grade

            student.status = status



            student.save()



            return JsonResponse({

                "message": "Student updated"

            })



        except Student.DoesNotExist:

            return JsonResponse({

                "error": "Student not found"

            }, status=404)



    return JsonResponse({

        "error": "Invalid request"

    }, status=400)


@csrf_exempt
def delete_student(request, student_id):

    if request.method == 'DELETE':

        try:

            student = Student.objects.get(id=student_id)

            student.delete()

            return JsonResponse({
                "message": "Student deleted successfully"
            })

        except Student.DoesNotExist:

            return JsonResponse({
                "error": "Student not found"
            }, status=404)

    return JsonResponse({
        "error": "Only DELETE method allowed"
    }, status=405)


@csrf_exempt
def calculate(request):

    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            name = data.get('name')
            marks = data.get('marks', [])

            total = sum(marks)
            percentage = total / len(marks) if marks else 0

            if percentage >= 90:
                grade = 'A'
            elif percentage >= 75:
                grade = 'B'
            elif percentage >= 60:
                grade = 'C'
            elif percentage >= 50:
                grade = 'D'
            else:
                grade = 'F'

            status = "Pass" if percentage >= 50 else "Fail"

            Student.objects.update_or_create(
                name=name,
                defaults={
                    'subject1': marks[0],
                    'subject2': marks[1],
                    'subject3': marks[2],
                    'subject4': marks[3],
                    'subject5': marks[4],
                    'total': total,
                    'percentage': percentage,
                    'grade': grade,
                    'status': status
                }
            )

            return JsonResponse({
                'name': name,
                'total': total,
                'percentage': percentage,
                'grade': grade,
                'status': status
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    
    return JsonResponse({'error': 'Only POST allowed'}, status=405)