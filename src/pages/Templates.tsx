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
              <Card
                key={template.id}
                className="group relative overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-card-hover transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <div
                  className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
                  onClick={() => navigate(`/template/${template.id}/preview`)}
                >
                  <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />

                  {/* Category pill */}
                  <Badge
                    variant="secondary"
                    className="absolute top-3 left-3 bg-background/90 text-foreground border border-border backdrop-blur-sm font-medium"
                  >
                    {template.category}
                  </Badge>

                  {/* Premium badge */}
                  {template.isPremium && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-0 font-medium">
                      Premium
                    </Badge>
                  )}

                  {/* Hover overlay actions */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-background text-foreground hover:bg-background/90 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/template/${template.id}/preview`);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/editor/${template.id}`);
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-1.5" />
                        Customize
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                    {template.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {template.description}
                  </p>

                  {/* Meta row */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-medium text-foreground">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                        {template.rating}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        {template.downloads.toLocaleString()}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                      onClick={() => navigate(`/template/${template.id}`)}
                    >
                      Details
                      <Info className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
