from django.shortcuts import render

from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import View

class LoginView(View):
    def get(self,request):
        return render(request,'login.html')

    def post(self,request):
        return render(request,'login.html')
    

def test_api(request):
    data = {"message": "Frontend and Backend are connected!"}
    return JsonResponse(data)

