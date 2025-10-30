<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentAccountRequest;
use App\Http\Requests\UpdatePaymentAccountRequest;
use App\Models\PaymentAccount;

class PaymentAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentAccountRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentAccount $paymentAccount)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentAccount $paymentAccount)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentAccountRequest $request, PaymentAccount $paymentAccount)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentAccount $paymentAccount)
    {
        //
    }
}
