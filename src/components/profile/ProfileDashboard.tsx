import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Edit, Save, TrendingUp } from "lucide-react";
import { userStorage, customizedTemplateStorage } from "@/lib/storage";

export function ProfileDashboard() {
  const user = userStorage.getCurrentUser();
  const customized = customizedTemplateStorage.getByUserId(user?.id || "");
  const drafts = customized.filter(t => t.isDraft);
  const completed = customized.filter(t => !t.isDraft);

  const stats = [
    {
      title: "Total Templates",
      value: customized.length,
      icon: FileText,
      description: "All your templates",
    },
    {
      title: "Customized",
      value: completed.length,
      icon: Edit,
      description: "Finished designs",
    },
    {
      title: "Drafts",
      value: drafts.length,
      icon: Save,
      description: "Work in progress",
    },
    {
      title: "This Month",
      value: customized.filter(t => {
        const date = new Date(t.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      description: "Created recently",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your template activity
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="font-semibold mb-2">Browse Templates</h3>
            <p className="text-sm text-muted-foreground">
              Discover new designs for your next project
            </p>
          </Card>
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="font-semibold mb-2">Continue Editing</h3>
            <p className="text-sm text-muted-foreground">
              Pick up where you left off with your drafts
            </p>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
