import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, PaymentAccount } from '@/types';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import InputError from '@/components/InputError';

interface PaymentAccountEditProps extends PageProps {
  paymentAccount: PaymentAccount;
}

export default function Edit({ auth, paymentAccount }: PaymentAccountEditProps) {
  const { data, setData, put, processing, errors, reset } = useForm({
    handle: paymentAccount.handle,
    type: paymentAccount.type,
    name: paymentAccount.name || '',
    description: paymentAccount.description || '',
    status: paymentAccount.status,
    metadata: paymentAccount.metadata || {},
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/payment-accounts/${paymentAccount.id}`, {
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
          Edit Payment Account
        </h2>
      }
    >
      <Head title="Edit Payment Account" />

      <div className="py-12">
        <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <form onSubmit={submit} className="p-6 space-y-6">
              {/* Handle */}
              <div>
                <InputLabel htmlFor="handle" value="Handle" />
                <TextInput
                  id="handle"
                  type="text"
                  className="mt-1 block w-full"
                  value={data.handle}
                  onChange={(e) => setData('handle', e.target.value)}
                  placeholder="e.g., @username or phone-number"
                  required
                />
                <InputError message={errors.handle} className="mt-2" />
              </div>

              {/* Type */}
              <div>
                <InputLabel htmlFor="type" value="Type" />
                <select
                  id="type"
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value as any)}
                >
                  <option value="venmo">Venmo</option>
                  <option value="zelle">Zelle</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash_app">Cash App</option>
                </select>
                <InputError message={errors.type} className="mt-2" />
              </div>

              {/* Name */}
              <div>
                <InputLabel htmlFor="name" value="Name (Optional)" />
                <TextInput
                  id="name"
                  type="text"
                  className="mt-1 block w-full"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., My Personal Venmo"
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Description */}
              <div>
                <InputLabel htmlFor="description" value="Description (Optional)" />
                <textarea
                  id="description"
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  rows={3}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Brief description of this payment account"
                />
                <InputError message={errors.description} className="mt-2" />
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <InputError message={errors.status} className="mt-2" />
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
                  {processing ? 'Updating...' : 'Update Payment Account'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
