<?php

namespace App\Constants;

enum PaymentAccountType: string
{
    case VENMO = 'venmo';
    case ZELLE = 'zelle';
    case PAYPAL = 'paypal';
    case CASH_APP = 'cash_app';
}
