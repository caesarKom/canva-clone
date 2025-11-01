"use client"

import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { templateList, TemplateType } from '@/lib/templates'
import { TemplateCard } from '@/components/templates/template-card'
import { useState } from 'react'

const categories = [
  { id: 'all', name: 'All Templates', icon: '📁' },
  { id: 'document', name: 'Documents', icon: '📄' },
  { id: 'presentation', name: 'Presentations', icon: '📊' },
  { id: 'social', name: 'Social Media', icon: '📱' },
  { id: 'email', name: 'Email', icon: '📧' },
  { id: 'video', name: 'Video', icon: '🎥' },
  { id: 'infographic', name: 'Infographics', icon: '📈' },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = (categoryId: string) => {
    return templateList.filter((t) => {
      const matchesCategory = categoryId === 'all' || t.category === categoryId
      const matchesSearch = searchQuery === '' || 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesCategory && matchesSearch
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">Templates</h1>
          <p className="text-gray-600 mb-6">
            Start with {templateList.length} professionally designed templates
          </p>
          <Input
            placeholder="Search templates..."
            className="max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="gap-2">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => {
            const templates = filteredTemplates(category.id)
            
            return (
              <TabsContent key={category.id} value={category.id}>
                {templates.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No templates found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {templates.map((template: any) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        categoryIcon={categories.find(c => c.id === template.category)?.icon}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}
