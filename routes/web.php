<?php

use App\Constants\PaymentAccountType;
use App\Http\Controllers\ProfileController;
use App\Models\PaymentAccount;
use App\Models\PaymentRequest;
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
            'type' => 'required|in:venmo,zelle,paypal,cash_app',
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
            'type' => 'required|in:venmo,zelle,paypal,cash_app',
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

    // Payment Requests Routes
    Route::get('/payment-requests', function () {
        return Inertia::render('payment-requests/index', [
            'paymentRequests' => PaymentRequest::where('owner_id', Auth::id())
                ->with('owner')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    })->name('payment-requests.index');

    Route::get('/payment-requests/create', function () {
        return Inertia::render('payment-requests/create');
    })->name('payment-requests.create');

    Route::post('/payment-requests', function (Request $request) {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'currency' => 'required|string|size:3',
            'amount' => 'required|numeric|min:0.01',
            'status' => 'required|in:pending,paid,cancelled',
            'expires_at' => 'nullable|date',
            'metadata' => 'nullable|array',
        ]);

        $validated['owner_id'] = Auth::id();

        PaymentRequest::create($validated);

        return redirect()->route('payment-requests.index')
            ->with('success', 'Payment request created successfully.');
    })->name('payment-requests.store');

    Route::get('/payment-requests/{paymentRequest}', function (PaymentRequest $paymentRequest) {
        if ($paymentRequest->owner_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('payment-requests/show', [
            'paymentRequest' => $paymentRequest->load('owner'),
            'paymentAccounts' => PaymentAccount::where('owner_id', $paymentRequest->owner_id)
                ->where('status', 'active')
                ->get()
        ]);
    })->name('payment-requests.show');

    Route::get('/payment-requests/{paymentRequest}/edit', function (PaymentRequest $paymentRequest) {
        if ($paymentRequest->owner_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('payment-requests/edit', [
            'paymentRequest' => $paymentRequest->load('owner')
        ]);
    })->name('payment-requests.edit');

    Route::put('/payment-requests/{paymentRequest}', function (Request $request, PaymentRequest $paymentRequest) {
        if ($paymentRequest->owner_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'currency' => 'required|string|size:3',
            'amount' => 'required|numeric|min:0.01',
            'status' => 'required|in:pending,paid,cancelled',
            'expires_at' => 'nullable|date',
            'metadata' => 'nullable|array',
        ]);

        // Set paid_at when status changes to paid
        if ($validated['status'] === 'paid' && $paymentRequest->status !== 'paid') {
            $validated['paid_at'] = now();
        } elseif ($validated['status'] !== 'paid') {
            $validated['paid_at'] = null;
        }

        $paymentRequest->update($validated);

        return redirect()->route('payment-requests.show', $paymentRequest)
            ->with('success', 'Payment request updated successfully.');
    })->name('payment-requests.update');

    Route::delete('/payment-requests/{paymentRequest}', function (PaymentRequest $paymentRequest) {
        if ($paymentRequest->owner_id !== Auth::id()) {
            abort(403);
        }

        $paymentRequest->delete();

        return redirect()->route('payment-requests.index')
            ->with('success', 'Payment request deleted successfully.');
    })->name('payment-requests.destroy');
});

// Vanity Routes (Public)
Route::get('/pay/{handle}', function (string $handle) {
    // Find payment account by handle to get the owner
    $paymentAccount = PaymentAccount::where('handle', $handle)
        ->where('status', 'active')
        ->with('owner')
        ->first();

    if (!$paymentAccount) {
        abort(404, 'Payment account not found');
    }

    $owner = $paymentAccount->owner;

    // Get all active payment accounts for this owner
    $paymentAccounts = PaymentAccount::where('owner_id', $owner->id)
        ->where('status', 'active')
        ->get();

    return Inertia::render('pay/index', [
        'owner' => $owner,
        'paymentAccounts' => $paymentAccounts,
    ]);
})->name('pay.index');

Route::get('/pay/{handle}/{token}', function (string $handle, string $token) {
    // Find payment request by token
    $paymentRequest = PaymentRequest::where('token', $token)
        ->with('owner')
        ->first();

    if (!$paymentRequest) {
        abort(404, 'Payment request not found');
    }

    // Verify the handle matches one of the owner's payment accounts
    $paymentAccount = PaymentAccount::where('handle', $handle)
        ->where('owner_id', $paymentRequest->owner_id)
        ->where('status', 'active')
        ->first();

    if (!$paymentAccount) {
        abort(404, 'Payment account not found for this user');
    }

    // Get all active payment accounts for the owner
    $paymentAccounts = PaymentAccount::where('owner_id', $paymentRequest->owner_id)
        ->where('status', 'active')
        ->get();

    return Inertia::render('pay/show', [
        'owner' => $paymentRequest->owner,
        'paymentRequest' => $paymentRequest,
        'paymentAccounts' => $paymentAccounts,
    ]);
})->name('pay.show');

require __DIR__ . '/auth.php';
