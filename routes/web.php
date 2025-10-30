<?php

use App\Http\Controllers\ProfileController;
use App\Models\PaymentAccount;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Payment Accounts Routes
    Route::get('/payment-accounts', function () {
        return Inertia::render('payment-accounts/index', [
            'paymentAccounts' => PaymentAccount::where('owner_id', Auth::id())->get()
        ]);
    })->name('payment-accounts.index');

    Route::get('/payment-accounts/create', function () {
        return Inertia::render('payment-accounts/create');
    })->name('payment-accounts.create');

    Route::post('/payment-accounts', function (Request $request) {
        $validated = $request->validate([
            'handle' => 'required|string|max:255|unique:payment_accounts,handle',
            'type' => 'required|in:bank,card,wallet,crypto',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|in:active,inactive,suspended',
            'metadata' => 'nullable|array',
        ]);

        $validated['owner_id'] = Auth::id();

        PaymentAccount::create($validated);

        return redirect()->route('payment-accounts.index')
            ->with('success', 'Payment account created successfully.');
    })->name('payment-accounts.store');

    Route::get('/payment-accounts/{paymentAccount}', function (PaymentAccount $paymentAccount) {
        if ($paymentAccount->owner_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('payment-accounts/show', [
            'paymentAccount' => $paymentAccount
        ]);
    })->name('payment-accounts.show');

    Route::get('/payment-accounts/{paymentAccount}/edit', function (PaymentAccount $paymentAccount) {
        if ($paymentAccount->owner_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('payment-accounts/edit', [
            'paymentAccount' => $paymentAccount
        ]);
    })->name('payment-accounts.edit');

    Route::put('/payment-accounts/{paymentAccount}', function (Request $request, PaymentAccount $paymentAccount) {
        if ($paymentAccount->owner_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'handle' => 'required|string|max:255|unique:payment_accounts,handle,' . $paymentAccount->id,
            'type' => 'required|in:bank,card,wallet,crypto',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|in:active,inactive,suspended',
            'metadata' => 'nullable|array',
        ]);

        $paymentAccount->update($validated);

        return redirect()->route('payment-accounts.show', $paymentAccount)
            ->with('success', 'Payment account updated successfully.');
    })->name('payment-accounts.update');

    Route::delete('/payment-accounts/{paymentAccount}', function (PaymentAccount $paymentAccount) {
        if ($paymentAccount->owner_id !== Auth::id()) {
            abort(403);
        }

        $paymentAccount->delete();

        return redirect()->route('payment-accounts.index')
            ->with('success', 'Payment account deleted successfully.');
    })->name('payment-accounts.destroy');
});

require __DIR__ . '/auth.php';
