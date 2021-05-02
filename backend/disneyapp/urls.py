from django.urls import path
from . import views


urlpatterns = [
    path('spot/list', views.spot_list, name="spot_list"),
    path('search', views.search, name="search")
]