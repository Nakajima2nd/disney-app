from django.urls import path
from . import views


urlpatterns = [
    path('spot/list', views.spot_list, name="spot_list"),
    path('search', views.search, name="search"),
    path('business-hours', views.business_hours, name="business_hours"),
    path('ticket-reservation', views.ticket_reservation, name="ticket_reservation"),
    path('debug', views.debug, name="debug"),
]