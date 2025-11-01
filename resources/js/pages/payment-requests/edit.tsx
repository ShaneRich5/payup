import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, PaymentRequest } from '@/types';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import InputError from '@/components/InputError';

interface PaymentRequestEditProps extends PageProps {
  paymentRequest: PaymentRequest;
}

export default function Edit({ auth, paymentRequest }: PaymentRequestEditProps) {
  const { data, setData, put, processing, errors, reset } = useForm({
    title: paymentRequest.title || '',
    description: paymentRequest.description || '',
    currency: paymentRequest.currency,
    amount: paymentRequest.amount.toString(),
    status: paymentRequest.status,
    expires_at: paymentRequest.expires_at ? new Date(paymentRequest.expires_at).toISOString().slice(0, 16) : '',
    metadata: paymentRequest.metadata || {},
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/payment-requests/${paymentRequest.id}`, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleMetadataChange = (key: string, value: string) => {
    setData('metadata', {
      ...data.metadata,
      [key]: value,
    });
  };

  const addMetadataField = () => {
    const key = prompt('Enter metadata key:');
    if (key) {
      setData('metadata', {
        ...data.metadata,
        [key]: '',
      });
    }
  };

  const removeMetadataField = (key: string) => {
    const newMetadata = { ...data.metadata };
    delete newMetadata[key];
    setData('metadata', newMetadata);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Edit Payment Request
        </h2>
      }
    >
      <Head title="Edit Payment Request" />

      <div className="py-12">
        <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <form onSubmit={submit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <InputLabel htmlFor="title" value="Title (Optional)" />
                <TextInput
                  id="title"
                  type="text"
                  className="mt-1 block w-full"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="e.g., Dinner Bill, Project Payment"
                />
                <InputError message={errors.title} className="mt-2" />
              </div>

              {/* Description */}
              <div>
                <InputLabel htmlFor="description" value="Description (Optional)" />
                <textarea
                  id="description"
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Add any additional details about this payment request..."
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <InputLabel htmlFor="amount" value="Amount" />
                  <TextInput
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full"
                    value={data.amount}
                    onChange={(e) => setData('amount', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <InputError message={errors.amount} className="mt-2" />
                </div>
                <div>
                  <InputLabel htmlFor="currency" value="Currency" />
                  <select
                    id="currency"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                    value={data.currency}
                    onChange={(e) => setData('currency', e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                  <InputError message={errors.currency} className="mt-2" />
                </div>
              </div>

              {/* Status */}
              <div>
                <InputLabel htmlFor="status" value="Status" />
                <select
                  id="status"
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value as any)}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <InputError message={errors.status} className="mt-2" />
              </div>

              {/* Expires At */}
              <div>
                <InputLabel htmlFor="expires_at" value="Expires At (Optional)" />
                <TextInput
                  id="expires_at"
                  type="datetime-local"
                  className="mt-1 block w-full"
                  value={data.expires_at}
                  onChange={(e) => setData('expires_at', e.target.value)}
                />
                <InputError message={errors.expires_at} className="mt-2" />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Leave empty for no expiration date
                </p>
              </div>

              {/* Metadata */}
              <div>
                <div className="flex items-center justify-between">
                  <InputLabel value="Metadata (Optional)" />
                  <button
                    type="button"
                    onClick={addMetadataField}
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Field
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {Object.entries(data.metadata).map(([key, value]) => (
                    <div key={key} className="flex space-x-2">
                      <TextInput
                        type="text"
                        value={key}
                        disabled
                        className="flex-1 bg-gray-100 dark:bg-gray-600"
                      />
                      <TextInput
                        type="text"
                        value={value}
                        onChange={(e) => handleMetadataChange(key, e.target.value)}
                        placeholder="Value"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetadataField(key)}
                        className="px-3 py-2 text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {Object.keys(data.metadata).length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No metadata fields added. Click "Add Field" to add custom data.
                    </p>
                  )}
                </div>
                <InputError message={errors.metadata} className="mt-2" />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4">
                <SecondaryButton
                  type="button"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton disabled={processing}>
                  {processing ? 'Updating...' : 'Update Payment Request'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

