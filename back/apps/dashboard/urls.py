from django.urls import path
from .views import DashboardStatsView, DashboardRecentActivityView

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='admin-stats'),
    path('activity/', DashboardRecentActivityView.as_view(), name='admin-activity'),
]