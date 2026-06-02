"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Library,
  Plus,
  BookOpen,
  User,
  Star,
  Clock,
} from "lucide-react";

const sampleSources = [
  { id: "1", name: "صحيح البخاري", author: "الإمام البخاري", type: "كتاب حديث", reliability: "متفق عليه" },
  { id: "2", name: "صحيح مسلم", author: "الإمام مسلم", type: "كتاب حديث", reliability: "متفق عليه" },
  { id: "3", name: "سنن أبي داود", author: "أبو داود السجستاني", type: "كتاب حديث", reliability: "حسن" },
  { id: "4", name: "سنن الترمذي", author: "الترمذي", type: "كتاب حديث", reliability: "حسن" },
  { id: "5", name: "مسند أحمد", author: "الإمام أحمد", type: "كتاب حديث", reliability: "يختلف" },
];

export default function AdminSourcesPage() {
  const [search, setSearch] = useState("");

  const filtered = sampleSources.filter((s) =>
    s.name.includes(search) || s.author?.includes(search)
  );

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">المصادر</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة مصادر الأحاديث والسنن</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة مصدر
        </Button>
      </motion.div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث عن مصدر..."
          className="pr-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="glass-card border-border/50">
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {filtered.map((source, i) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{source.name}</p>
                    <p className="text-xs text-muted-foreground">{source.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">{source.type}</Badge>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {source.reliability}
                  </span>
                  <Button size="sm" variant="ghost" className="h-8">
                    تعديل
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
