import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Eye, Info, Pencil, Star, Download } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { templateStorage, type Template } from "@/lib/storage";
import { Header } from "@/components/Header";

const Templates = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["all", "Birthday", "Wedding", "Condolence", "Anniversary", "Corporate"];

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, searchQuery, sortBy]);

  const loadTemplates = () => {
    let filtered = templateStorage.getPublic();

    if (selectedCategory !== "all") {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = templateStorage.search(searchQuery);
    }

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.downloads - a.downloads;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setTemplates(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Browse Templates</h1>
          <p className="text-muted-foreground">
            Discover {templates.length} professionally designed templates
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "all" ? "All" : cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No templates found. Try adjusting your filters.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="group overflow-hidden hover:shadow-elegant transition-all">
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={template.thumbnail}
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {template.isPremium && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        Premium
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{template.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{template.downloads}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/template/${template.id}/preview`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/template/${template.id}`)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/editor/${template.id}`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Customize
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
