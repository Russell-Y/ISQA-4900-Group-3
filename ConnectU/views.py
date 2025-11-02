from django.shortcuts import render

from django.http import JsonResponse

def test_api(request):
    data = {"message": "Frontend and Backend are connected!"}
    return JsonResponse(data)

