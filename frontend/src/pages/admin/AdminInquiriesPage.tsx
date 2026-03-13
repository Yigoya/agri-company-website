import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contactApi } from '@/api/contact';
import { formatDate } from '@/utils/format';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { ContactInquiry } from '@/types';

export default function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inquiries', page, showArchived],
    queryFn: () => contactApi.getInquiries({ page, page_size: 20, is_archived: showArchived }),
  });

  const markReadMutation = useMutation({
    mutationFn: contactApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-unread'] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: contactApi.archive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('Inquiry archived');
      setSelectedInquiry(null);
    },
    onError: () => toast.error('Failed to archive'),
  });

  const deleteMutation = useMutation({
    mutationFn: contactApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('Inquiry deleted');
      setSelectedInquiry(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const handleSelect = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.is_read) {
      markReadMutation.mutate(inquiry.id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Inquiries</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowArchived(false); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${!showArchived ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Active
          </button>
          <button
            onClick={() => { setShowArchived(true); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${showArchived ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Archived
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1">
          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : data?.items.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No {showArchived ? 'archived' : 'active'} inquiries.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data?.items.map((inquiry) => (
                <button
                  key={inquiry.id}
                  onClick={() => handleSelect(inquiry)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selectedInquiry?.id === inquiry.id
                      ? 'bg-primary-50 border-primary-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } ${!inquiry.is_read ? 'border-l-4 border-l-primary-500' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-medium text-sm ${!inquiry.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {inquiry.name}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(inquiry.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{inquiry.subject}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedInquiry.subject}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    From {selectedInquiry.name} &middot; {formatDate(selectedInquiry.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!showArchived && (
                    <button
                      onClick={() => archiveMutation.mutate(selectedInquiry.id)}
                      className="text-xs text-gray-600 hover:text-gray-800 font-medium px-3 py-1.5 border border-gray-200 rounded-lg"
                    >
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => { if (confirm('Delete this inquiry?')) deleteMutation.mutate(selectedInquiry.id); }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 border border-red-200 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedInquiry.email}</p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedInquiry.phone}</p>
                  </div>
                )}
                {selectedInquiry.company && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Company</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedInquiry.company}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Message</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
