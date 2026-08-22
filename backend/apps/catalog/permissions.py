from rest_framework.permissions import BasePermission

from apps.accounts.models import UserRole


class CanManageProducts(BasePermission):
    """
    Ürün oluşturma/güncelleme için rol bazlı yetkilendirme.

    Yetkili roller: super_admin, admin, editor, dealer.
    customer ve rolsüz/anonim kullanıcılar reddedilir.

    has_permission False döndüğünde DRF'in kendi mekanizması
    devreye girer: kullanıcı authenticate olmamışsa (JWT header
    yok/geçersiz) 401, authenticate olmuş ama yetkisizse 403 döner.
    Bu davranış için ekstra kod yazmamıza gerek yok.
    """

    allowed_roles = (
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.EDITOR,
        UserRole.DEALER,
    )

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        return user.role in self.allowed_roles