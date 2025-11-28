import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react'
import Link from 'next/link'
import { helpArticles } from '@/lib/help-articles'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function HelpArticlePage({ params }: PageProps) {
  const session = await auth()
  if (!session) redirect('/login')

  const { slug } = await params
  const article = helpArticles[slug]

  if (!article) {
    notFound()
  }

  return (
    <div className="space-y-8 p-6 md:p-8 lg:p-10 max-w-[900px] mx-auto">
      {/* Back Button */}
      <Link href="/dashboard/help">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </Button>
      </Link>

      {/* Article Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {article.description}
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span>Last updated: {article.lastUpdated}</span>
          <span>•</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>

      {/* Article Content */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div 
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </CardContent>
      </Card>

      {/* Related Articles */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {article.relatedArticles.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/dashboard/help/articles/${related.slug}`}
                    className="text-primary hover:underline"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Feedback */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">Was this article helpful?</p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                Yes
              </Button>
              <Button variant="outline" className="gap-2">
                <ThumbsDown className="h-4 w-4" />
                No
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share */}
      <div className="flex justify-center">
        <Button variant="ghost" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share this article
        </Button>
      </div>
    </div>
  )
}

