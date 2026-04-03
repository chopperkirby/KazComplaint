import { createContext, useContext, useState, ReactNode } from 'react';
import { Complaint, Comment } from '@/../../shared/types';
import { mockComplaints } from '@/../../shared/mockData';

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  getComplaintById: (id: string) => Complaint | undefined;
  addComment: (complaintId: string, comment: Comment) => void;
  deleteComplaint: (id: string) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export function ComplaintProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);

  const addComplaint = (complaint: Complaint) => {
    setComplaints([complaint, ...complaints]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(
      complaints.map((c) =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const getComplaintById = (id: string) => {
    return complaints.find((c) => c.id === id);
  };

  const addComment = (complaintId: string, comment: Comment) => {
    updateComplaint(complaintId, {
      comments: [...(getComplaintById(complaintId)?.comments || []), comment],
    });
  };

  const deleteComplaint = (id: string) => {
    setComplaints(complaints.filter((c) => c.id !== id));
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        addComplaint,
        updateComplaint,
        getComplaintById,
        addComment,
        deleteComplaint,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within ComplaintProvider');
  }
  return context;
}
