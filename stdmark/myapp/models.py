from django.db import models
class Student(models.Model):
    name = models.CharField(max_length=100, unique=True)
    subject1 = models.IntegerField()
    subject2 = models.IntegerField()
    subject3 = models.IntegerField()
    subject4 = models.IntegerField()
    subject5 = models.IntegerField()

    total = models.IntegerField()
    percentage = models.FloatField()
    grade = models.CharField(max_length=2)
    status = models.CharField(max_length=10)

    def __str__(self):
        return self.name