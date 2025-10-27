// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// const templates = [
//   {
//     id: 'cv-modern',
//     name: 'Modern CV',
//     category: 'document',
//     thumbnail: '/templates/cv-modern.png',
//     width: 794,
//     height: 1123,
//   },
//   {
//     id: 'cv-creative',
//     name: 'Creative CV',
//     category: 'document',
//     thumbnail: '/templates/cv-creative.png',
//     width: 794,
//     height: 1123,
//   },
//   {
//     id: 'presentation-business',
//     name: 'Business Presentation',
//     category: 'presentation',
//     thumbnail: '/templates/presentation-business.png',
//     width: 1920,
//     height: 1080,
//   },
//   {
//     id: 'social-instagram',
//     name: 'Instagram Post',
//     category: 'social',
//     thumbnail: '/templates/social-instagram.png',
//     width: 1080,
//     height: 1080,
//   },
//   {
//     id: 'social-story',
//     name: 'Instagram Story',
//     category: 'social',
//     thumbnail: '/templates/social-story.png',
//     width: 1080,
//     height: 1920,
//   },
//   {
//     id: 'email-newsletter',
//     name: 'Email Newsletter',
//     category: 'email',
//     thumbnail: '/templates/email-newsletter.png',
//     width: 600,
//     height: 800,
//   },
//   {
//     id: 'infographic-modern',
//     name: 'Modern Infographic',
//     category: 'infographic',
//     thumbnail: '/templates/infographic-modern.png',
//     width: 800,
//     height: 2000,
//   },
//   {
//     id: 'video-thumbnail',
//     name: 'YouTube Thumbnail',
//     category: 'video',
//     thumbnail: '/templates/video-thumbnail.png',
//     width: 1280,
//     height: 720,
//   },
// ]

// const categories = [
//   { id: 'all', name: 'All Templates' },
//   { id: 'document', name: 'Documents' },
//   { id: 'presentation', name: 'Presentations' },
//   { id: 'social', name: 'Social Media' },
//   { id: 'email', name: 'Email' },
//   { id: 'video', name: 'Video' },
//   { id: 'infographic', name: 'Infographics' },
// ]

// export default function TemplatesPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="border-b bg-white">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <h1 className="text-3xl font-bold mb-4">Templates</h1>
//           <Input
//             placeholder="Search templates..."
//             className="max-w-md"
//           />
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <Tabs defaultValue="all" className="w-full">
//           <TabsList className="mb-8">
//             {categories.map((category) => (
//               <TabsTrigger key={category.id} value={category.id}>
//                 {category.name}
//               </TabsTrigger>
//             ))}
//           </TabsList>

//           {categories.map((category) => (
//             <TabsContent key={category.id} value={category.id}>
//               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {templates
//                   .filter((t) => category.id === 'all' || t.category === category.id)
//                   .map((template) => (
//                     <Link
//                       key={template.id}
//                       href={`/editor/new?template=${template.id}`}
//                     >
//                       <div className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow cursor-pointer group">
//                         <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg relative overflow-hidden">
//                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
//                         </div>
//                         <div className="p-4">
//                           <h3 className="font-semibold truncate">{template.name}</h3>
//                           <p className="text-sm text-gray-500">
//                             {template.width} × {template.height}
//                           </p>
//                           <Button className="w-full mt-3" size="sm">
//                             Use Template
//                           </Button>
//                         </div>
//                       </div>
//                     </Link>
//                   ))}
//               </div>
//             </TabsContent>
//           ))}
//         </Tabs>
//       </div>
//     </div>
//   )
// }

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { templateList } from '@/lib/templates'

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
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">Templates</h1>
          <p className="text-gray-600 mb-6">
            Start with {templateList.length} professionally designed templates
          </p>
          <Input
            placeholder="Search templates..."
            className="max-w-md"
          />
        </div>
      </div>

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

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templateList
                  .filter((t) => category.id === 'all' || t.category === category.id)
                  .map((template) => (
                    <Link
                      key={template.id}
                      href={`/editor/new?template=${template.id}`}
                      className="group"
                    >
                      <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all cursor-pointer overflow-hidden">
                        <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                            <Button 
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              size="lg"
                            >
                              Use Template
                            </Button>
                          </div>
                          <div className="text-center p-8">
                            <div className="text-6xl mb-4">
                              {categories.find(c => c.id === template.category)?.icon}
                            </div>
                            <div className="text-sm font-mono text-gray-600">
                              {template.width} × {template.height}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {template.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
