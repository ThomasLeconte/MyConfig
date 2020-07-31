from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from .models import component, user
import json

# Create your views here.

def home(request):
    queryset = component.objects.all().order_by('comp_id')
    print(queryset)
    return JsonResponse(
        {"connected":"ok"}
    )

def checkCredentials(request, _login, _password):
    queryset = user.objects.filter(user_name=_login).filter(user_password=_password)
    data = list(queryset)
    if type(data[0]) == user:
        return JsonResponse(
            {"connected":True, 
            "id":str(data[0].user_id),
            "username":str(data[0].user_name),
            "role":str(data[0].user_role)
            }
        )

def getProductsNumberByCategory(request, _categories):
    categories = _categories.split('&')
    for i in range(0, len(categories)): 
        categories[i] = int(categories[i])
    
    products = []
    for i in range(0, len(categories)):
        queryset = component.objects.filter(comp_type=categories[i]).count()
        products.append(queryset)

    return JsonResponse(
        products, safe=False
    )

def getProductsByCategory(request, _category):
    products = []
    queryset = component.objects.filter(comp_type=int(_category))
    data = list(queryset)

    response = []

    for i in data:
        this = i.returnList()
        response.append(this)

    return JsonResponse(
        response, safe=False
    )


    


    
