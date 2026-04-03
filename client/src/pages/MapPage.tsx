import { useState } from 'react';
import { useComplaints } from '@/contexts/ComplaintContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapPin, AlertCircle } from 'lucide-react';
import { ALMATY_DISTRICTS, STATUS_CONFIG, URGENCY_CONFIG } from '@/../../shared/types';
import { ComplaintStatus, UrgencyLevel } from '@/../../shared/types';

export default function MapPage() {
  const { complaints } = useComplaints();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // District statistics
  const districtStats = ALMATY_DISTRICTS.map((district) => {
    const districtComplaints = complaints.filter((c) => c.location.district === district);
    return {
      name: district,
      total: districtComplaints.length,
      resolved: districtComplaints.filter((c) => c.status === 'resolved').length,
      inProgress: districtComplaints.filter((c) => c.status === 'in_progress').length,
      critical: districtComplaints.filter((c) => c.urgency === 'critical').length,
    };
  }).filter((item) => item.total > 0);

  const selectedDistrictComplaints = selectedDistrict
    ? complaints.filter((c) => c.location.district === selectedDistrict)
    : [];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Карта проблем</h1>
        <p className="text-muted-foreground">Визуализация жалоб по районам города</p>
      </div>

      {/* Map Visualization */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Districts Grid */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Обзор районов</CardTitle>
              <CardDescription>Нажмите на район для просмотра деталей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {districtStats.map((district) => (
                  <button
                    key={district.name}
                    onClick={() => setSelectedDistrict(selectedDistrict === district.name ? null : district.name)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedDistrict === district.name
                        ? 'border-[#0B6E7F] bg-[#0B6E7F]/10'
                        : 'border-border hover:border-[#0B6E7F]/50'
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-semibold text-foreground mb-2">{district.name}</p>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-[#0B6E7F]">{district.total}</p>
                        <p className="text-xs text-muted-foreground">жалоб</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Общая статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Всего жалоб</span>
                <span className="font-bold text-foreground">{complaints.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Затронутых районов</span>
                <span className="font-bold text-foreground">{districtStats.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Критических проблем</span>
                <span className="font-bold text-[#E74C3C]">
                  {complaints.filter((c) => c.urgency === 'critical').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Решено</span>
                <span className="font-bold text-[#27AE60]">
                  {complaints.filter((c) => c.status === 'resolved').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* District Comparison Chart */}
      <Card className="border-0 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Жалобы по районам</CardTitle>
          <CardDescription>Сравнение объемов жалоб</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={districtStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#0B6E7F" name="Всего" />
              <Bar dataKey="resolved" fill="#27AE60" name="Решено" />
              <Bar dataKey="critical" fill="#E74C3C" name="Критические" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Selected District Details */}
      {selectedDistrict && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{selectedDistrict} - Жалобы</CardTitle>
            <CardDescription>{selectedDistrictComplaints.length} жалоб в этом районе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDistrictComplaints.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Нет жалоб в этом районе</p>
              ) : (
                selectedDistrictComplaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-1 truncate">{complaint.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {complaint.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
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
                      </div>
                      <MapPin className="text-[#0B6E7F] flex-shrink-0" size={20} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
