from django.http import HttpResponse

def spot_list(request):
    return HttpResponse("this is spot_list")

def search(request):
    return HttpResponse("this is search")