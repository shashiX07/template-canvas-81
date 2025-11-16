import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  FileText, 
  ExternalLink, 
  Mail, 
  DollarSign,
  Download,
  Star,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { freelancerStorage, freelancerTemplateStorage, earningsStorage, type FreelancerProfile, type FreelancerTemplate } from "@/lib/storage";
import { formatCurrency } from "@/lib/freelancerUtils";
import { toast } from "sonner";

export function FreelancerManagement() {
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerProfile | null>(null);
  const [freelancerTemplates, setFreelancerTemplates] = useState<FreelancerTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadFreelancers();
  }, []);

  const loadFreelancers = () => {
    const allFreelancers = freelancerStorage.getAll();
    setFreelancers(allFreelancers);
  };

  const handleViewDetails = (freelancer: FreelancerProfile) => {
    setSelectedFreelancer(freelancer);
    const templates = freelancerTemplateStorage.getByFreelancerId(freelancer.userId);
    setFreelancerTemplates(templates);
    setShowDetailsDialog(true);
  };

  const handleApprove = async (freelancerId: string) => {
    const freelancer = freelancers.find(f => f.userId === freelancerId);
    if (!freelancer) return;

    const updated: FreelancerProfile = {
      ...freelancer,
      verificationStatus: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: 'admin-id', // Replace with actual admin ID
      isActive: true,
      updatedAt: new Date().toISOString()
    };

    freelancerStorage.save(updated);
    setFreelancers(prev => prev.map(f => f.userId === freelancerId ? updated : f));
    toast.success("Freelancer approved successfully");
    setShowDetailsDialog(false);
  };

  const handleReject = () => {
    if (!selectedFreelancer || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    const updated: FreelancerProfile = {
      ...selectedFreelancer,
      verificationStatus: 'rejected',
      verificationNotes: rejectionReason,
      updatedAt: new Date().toISOString()
    };

    freelancerStorage.save(updated);
    setFreelancers(prev => prev.map(f => f.userId === selectedFreelancer.userId ? updated : f));
    toast.success("Freelancer application rejected");
    setShowDetailsDialog(false);
    setShowRejectDialog(false);
    setRejectionReason("");
  };

  const handleSuspend = (freelancerId: string) => {
    const freelancer = freelancers.find(f => f.userId === freelancerId);
    if (!freelancer) return;

    const updated: FreelancerProfile = {
      ...freelancer,
      isActive: !freelancer.isActive,
      updatedAt: new Date().toISOString()
    };

    freelancerStorage.save(updated);
    setFreelancers(prev => prev.map(f => f.userId === freelancerId ? updated : f));
    toast.success(freelancer.isActive ? "Freelancer suspended" : "Freelancer reactivated");
  };

  const filteredFreelancers = freelancers.filter(f => {
    const matchesSearch = f.professionalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && f.verificationStatus === 'pending') ||
                      (activeTab === 'approved' && f.verificationStatus === 'approved') ||
                      (activeTab === 'rejected' && f.verificationStatus === 'rejected');
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: freelancers.length,
    pending: freelancers.filter(f => f.verificationStatus === 'pending').length,
    approved: freelancers.filter(f => f.verificationStatus === 'approved').length,
    rejected: freelancers.filter(f => f.verificationStatus === 'rejected').length,
    totalTemplates: freelancers.reduce((sum, f) => sum + f.totalTemplates, 0),
    totalEarnings: freelancers.reduce((sum, f) => sum + f.totalEarnings, 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Freelancers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">Total Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search freelancers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Freelancers List */}
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFreelancers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No freelancers found</p>
              </div>
            ) : (
              filteredFreelancers.map((freelancer) => (
                <div
                  key={freelancer.userId}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={freelancer.portfolioImages[0]} />
                    <AvatarFallback>{freelancer.professionalTitle[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-lg">{freelancer.userId}</h4>
                        <p className="text-sm text-muted-foreground">{freelancer.professionalTitle}</p>
                      </div>
                      <Badge
                        variant={
                          freelancer.verificationStatus === 'approved' ? 'default' :
                          freelancer.verificationStatus === 'pending' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {freelancer.verificationStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {freelancer.verificationStatus === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {freelancer.verificationStatus === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {freelancer.verificationStatus.charAt(0).toUpperCase() + freelancer.verificationStatus.slice(1)}
                      </Badge>
                    </div>

                    <p className="text-sm mt-2 line-clamp-2">{freelancer.bio}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {freelancer.expertise.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.expertise.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{freelancer.expertise.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {freelancer.totalTemplates} templates
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {freelancer.totalDownloads} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {freelancer.rating.toFixed(1)} ({freelancer.reviewCount})
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(freelancer.totalEarnings)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(freelancer)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {freelancer.verificationStatus === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspend(freelancer.userId)}
                      >
                        {freelancer.isActive ? 'Suspend' : 'Reactivate'}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Freelancer Details</DialogTitle>
            <DialogDescription>
              Review freelancer application and activity
            </DialogDescription>
          </DialogHeader>

          {selectedFreelancer && (
            <ScrollArea className="h-[calc(90vh-12rem)]">
              <div className="space-y-6 pr-4">
                {/* Professional Info */}
                <div>
                  <h3 className="font-semibold mb-3">Professional Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Professional Title</Label>
                      <p className="font-medium">{selectedFreelancer.professionalTitle}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Experience</Label>
                      <p className="font-medium">{selectedFreelancer.experienceYears} years</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="text-muted-foreground">Bio</Label>
                    <p className="mt-1">{selectedFreelancer.bio}</p>
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="font-semibold mb-3">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFreelancer.expertise.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h3 className="font-semibold mb-3">Links & Portfolio</h3>
                  <div className="space-y-2">
                    {selectedFreelancer.portfolioUrl && (
                      <a
                        href={selectedFreelancer.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Portfolio Website
                      </a>
                    )}
                    {selectedFreelancer.linkedinUrl && (
                      <a
                        href={selectedFreelancer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        LinkedIn Profile
                      </a>
                    )}
                    {selectedFreelancer.githubUrl && (
                      <a
                        href={selectedFreelancer.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        GitHub Profile
                      </a>
                    )}
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <h3 className="font-semibold mb-3">Resume</h3>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">{selectedFreelancer.resumeFileName}</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Portfolio Images */}
                {selectedFreelancer.portfolioImages.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Portfolio Images</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedFreelancer.portfolioImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Portfolio ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div>
                  <h3 className="font-semibold mb-3">Performance Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{selectedFreelancer.totalTemplates}</div>
                        <p className="text-xs text-muted-foreground">Total Templates</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{selectedFreelancer.approvedTemplates}</div>
                        <p className="text-xs text-muted-foreground">Approved</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{selectedFreelancer.totalDownloads}</div>
                        <p className="text-xs text-muted-foreground">Downloads</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{formatCurrency(selectedFreelancer.totalEarnings)}</div>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Templates */}
                <div>
                  <h3 className="font-semibold mb-3">Templates ({freelancerTemplates.length})</h3>
                  <div className="space-y-2">
                    {freelancerTemplates.map((template) => (
                      <div key={template.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{template.title}</p>
                          <p className="text-sm text-muted-foreground">{template.category}</p>
                        </div>
                        <Badge
                          variant={
                            template.submissionStatus === 'published' ? 'default' :
                            template.submissionStatus === 'approved' ? 'default' :
                            template.submissionStatus === 'under_review' ? 'secondary' :
                            'outline'
                          }
                        >
                          {template.submissionStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedFreelancer.verificationStatus === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      className="flex-1"
                      onClick={() => handleApprove(selectedFreelancer.userId)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve Freelancer
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setShowRejectDialog(true)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Freelancer Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be sent to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={5}
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleReject}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
