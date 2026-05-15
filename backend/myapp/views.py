from urllib import request
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Student
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate, login, logout
import random
from django.conf import settings
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException


@csrf_exempt
def register(request):

    if request.method == 'POST':

        data = json.loads(request.body)

        username = data.get('username')

        email = data.get('email')

        password = data.get('password')



        # CHECK USERNAME

        if User.objects.filter(

            username=username

        ).exists():

            return JsonResponse({

                "error":
                "Username already exists"

            }, status=400)



        # CHECK EMAIL

        if User.objects.filter(

            email=email

        ).exists():

            return JsonResponse({

                "error":
                "Email already exists"

            }, status=400)



        # CREATE USER

        User.objects.create_user(

            username=username,

            email=email,

            password=password

        )



        return JsonResponse({

            "message":
            "Account created successfully"

        })



    return JsonResponse({

        "error":
        "Only POST method allowed"

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

def check_username(request, username):

    exists = User.objects.filter(

        username=username

    ).exists()



    return JsonResponse({

        "exists": exists

    })

otp_storage = {}

@csrf_exempt
def send_otp(request):

    if request.method == "POST":

        try:

            data = json.loads(
                request.body
            )

            email = data.get(
                "email"
            )

            if not email:

                return JsonResponse({

                    "error":
                    "Email required"

                }, status=400)

            otp = str(

                random.randint(

                    100000,
                    999999

                )

            )

            otp_storage[email] = otp

            configuration = sib_api_v3_sdk.Configuration()

            configuration.api_key['api-key'] = (
                settings.BREVO_API_KEY
            )

            api_instance = (
                sib_api_v3_sdk.TransactionalEmailsApi(
                    sib_api_v3_sdk.ApiClient(
                        configuration
                    )
                )
            )

            send_smtp_email = (
                sib_api_v3_sdk.SendSmtpEmail(

                    to=[{

                        "email": email

                    }],

                    sender={

                        "name":
                        "Student Grade Calculator",

                        "email":
                        "gauthamkrishna004@gmail.com"

                    },

                    subject=
                    "OTP Verification",

                    html_content=
                    f"<h2>Your OTP is: {otp}</h2>"

                )
            )

            api_instance.send_transac_email(
                send_smtp_email
            )

            return JsonResponse({

                "message":
                "OTP sent successfully"

            })

        except ApiException as e:

            return JsonResponse({

                "error":
                str(e)

            }, status=500)

        except Exception as e:

            return JsonResponse({

                "error":
                str(e)

            }, status=500)

    return JsonResponse({

        "error":
        "Only POST allowed"

    })
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

        data = json.loads(request.body)

        student =Student.objects.get(id=id)



        student.name =data["name"]

        student.subject1 =data["subject1"]

        student.subject2 =data["subject2"]

        student.subject3 =data["subject3"]

        student.subject4 = data["subject4"]

        student.subject5 = data["subject5"]



        total = (

            student.subject1 +

            student.subject2 +

            student.subject3 +

            student.subject4 +

            student.subject5

        )



        percentage =total / 5



        student.total =total

        student.percentage =percentage



        if percentage >= 90:

            student.grade = "A"

        elif percentage >= 75:

            student.grade = "B"

        elif percentage >= 60:

            student.grade = "C"

        elif percentage >= 50:

            student.grade = "D"

        else:

            student.grade = "F"



        student.status = (

            "Pass"

            if percentage >= 50

            else "Fail"

        )



        student.save()



        return JsonResponse({

            "message":
            "Student updated"

        })



    return JsonResponse({

        "error":
        "Only PUT allowed"

    })
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