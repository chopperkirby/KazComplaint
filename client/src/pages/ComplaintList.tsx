import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { STATUS_CONFIG, CATEGORY_CONFIG, URGENCY_CONFIG, ALMATY_DISTRICTS } from '@/../../shared/types';
import { ComplaintStatus, ComplaintCategory, UrgencyLevel } from '@/../../shared/types';

export default function ComplaintList() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const role = user?.role;
  const { complaints } = useComplaints();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
      const matchesUrgency = urgencyFilter === 'all' || complaint.urgency === urgencyFilter;
      const matchesDistrict = districtFilter === 'all' || complaint.location.district === districtFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesUrgency && matchesDistrict;
    });
  }, [complaints, searchTerm, statusFilter, categoryFilter, urgencyFilter, districtFilter]);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {role === 'citizen' ? 'My Complaints' : 'Manage Complaints'}
        </h1>
        <p className="text-muted-foreground">
          {filteredComplaints.length} complaints found
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8 border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#0B6E7F]" />
            <h2 className="font-semibold text-foreground">Filters</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="pending_approval">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as any)}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="ecology">Ecology</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="akimat">Akimat</SelectItem>
              </SelectContent>
            </Select>

            {/* Urgency Filter */}
            <Select value={urgencyFilter} onValueChange={(value) => setUrgencyFilter(value as any)}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            {/* District Filter */}
            <Select value={districtFilter} onValueChange={(value) => setDistrictFilter(value)}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All districts</SelectItem>
                {ALMATY_DISTRICTS.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No complaints found</p>
              <Button
                onClick={() => navigate('/submit')}
                className="bg-[#0B6E7F] hover:bg-[#0A5A6B] text-white"
              >
                Submit new complaint
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => (
            <Card
              key={complaint.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/complaint/${complaint.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title and Status */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {complaint.title}
                      </h3>
                      <Badge
                        style={{
                          backgroundColor: STATUS_CONFIG[complaint.status as ComplaintStatus]?.bgColor,
                          color: STATUS_CONFIG[complaint.status as ComplaintStatus]?.color,
                        }}
                      >
                        {STATUS_CONFIG[complaint.status as ComplaintStatus]?.label}
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: URGENCY_CONFIG[complaint.urgency as UrgencyLevel]?.bgColor,
                          color: URGENCY_CONFIG[complaint.urgency as UrgencyLevel]?.color,
                        }}
                      >
                        {URGENCY_CONFIG[complaint.urgency as UrgencyLevel]?.label}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {complaint.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>Location: {complaint.location.district}</span>
                      <span>Date: {new Date(complaint.createdAt).toLocaleDateString('en-US')}</span>
                      <span>Comments: {complaint.comments.length}</span>
                      {complaint.rating && <span>Rating: {complaint.rating}/5</span>}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="text-muted-foreground flex-shrink-0" size={20} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
