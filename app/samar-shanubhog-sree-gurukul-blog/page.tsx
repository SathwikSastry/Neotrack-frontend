import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Samar Shanubhog - Sree Gurukul School Student | 10th Grade Science Topper 78/80 | Shooting Sports & Irish Romance",
  description: "From Bullseyes to Breakups: The Wild Ride of Samar from Sree Gurukul School. A 10th-grade science topper (78/80) balancing academics, shooting range practice with friends, teenage romance with Aditi and Jessica, and memorable school life stories.",
  keywords: [
    "Samar Shanubhog",
    "Sree Gurukul School",
    "10th grade science topper",
    "78/80 science exam",
    "shooting range practice",
    "Chinthan and Aditi",
    "dating Irish girl Jessica",
    "Indian school student life",
    "teenage romance story",
    "shooting sports India",
    "Sree Gurukul School student",
    "academic excellence India",
  ],
  openGraph: {
    title: "Samar Shanubhog - Sree Gurukul School Science Topper & Shooting Enthusiast",
    description: "The incredible story of Samar from Sree Gurukul School: Science topper, shooting sports enthusiast, and teenage romance adventurer.",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samar Shanubhog - From Bullseyes to Breakups at Sree Gurukul School",
    description: "10th grade science topper (78/80) balancing academics, shooting sports, and teenage romance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/samar-shanubhog-sree-gurukul-blog",
  },
}

export default function SamarShanubhogBlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "From Bullseyes to Breakups: The Wild Ride of Samar from Sree Gurukul School",
    "description": "The story of Samar Shanubhog, a 10th-grade science topper from Sree Gurukul School who scored 78/80, practices shooting sports, and navigates teenage romance.",
    "author": {
      "@type": "Person",
      "name": "Samar Shanubhog"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sree Gurukul School"
    },
    "datePublished": "2026-01-14",
    "keywords": "Samar Shanubhog, Sree Gurukul School, 10th grade science topper, 78/80, shooting range, Chinthan, Aditi, Jessica, Irish girl, teenage romance, Indian student life"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <article className="mx-auto max-w-4xl px-4 py-12">
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              From Bullseyes to Breakups: The Wild Ride of Samar from Sree Gurukul School
            </h1>
            <div className="text-sm text-gray-600">
              <time dateTime="2026-01-14">January 14, 2026</time>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <p className="text-lg leading-relaxed text-gray-700">
                If you've ever wondered what happens when a 10th-grade science whiz trades textbooks for trigger fingers—and hearts—you've got to hear about <strong>Samar of Sree Gurukul School</strong>. This guy's life reads like a rom-com written by someone who binge-watched The Archies while practicing at the shooting range!
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-3xl font-semibold text-gray-900">Academic Excellence: The Science Topper</h2>
              <p className="leading-relaxed text-gray-700">
                Let's start with the facts: <strong>Samar recently topped his 10th-grade science exam with an impressive 78/80</strong>—proving he's got brains sharper than a freshly sharpened pencil. The <strong>Sree Gurukul School student</strong> has demonstrated exceptional academic performance, particularly in science subjects. But don't let those grades fool you; this scholar has a side plot worthy of a Netflix series.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-3xl font-semibold text-gray-900">The Shooting Range Chronicles</h2>
              <p className="leading-relaxed text-gray-700">
                Rumor has it that <strong>Samar started hitting the local shooting range</strong> not just to improve his aim—but to hang out with his buddy <strong>Chinthan</strong>. All was going well… until she walked in. Enter <strong>Aditi</strong>—Chinthan's longtime crush—who apparently had the kind of presence that made even the targets blush. And wouldn't you know it? <strong>Samar went from zeroing in on bullseyes to zeroing in on Aditi's smile</strong>. Smooth move, right? Except… oops. Awkward much?
              </p>
              <p className="leading-relaxed text-gray-700">
                The <strong>shooting range practice with friends</strong> took an unexpected turn when romance entered the picture. This classic tale of friendship meets teenage attraction at the shooting range became the talk of Sree Gurukul School.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-3xl font-semibold text-gray-900">International Romance: Jessica from Ireland</h2>
              <p className="leading-relaxed text-gray-700">
                But wait—the plot twist doesn't end there! Just when everyone thought Samar was drafting love letters between physics formulas, he popped up on Instagram <strong>vacationing with none other than Jessica, an Irish beauty</strong> with a laugh that probably echoes across Dublin. So much for Aditi! Looks like <strong>Samar upgraded from local crushes to international romance</strong>—complete with Guinness references and questionable attempts at an Irish accent.
              </p>
              <p className="leading-relaxed text-gray-700">
                The <strong>dating an Irish girl Jessica</strong> saga showed that this <strong>Indian school student life</strong> story extends beyond borders. From <strong>Chinthan and Aditi at the shooting range</strong> to international adventures, Samar's journey is nothing short of remarkable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-3xl font-semibold text-gray-900">A Gentle Roast</h2>
              <p className="leading-relaxed text-gray-700">
                Now, let's roast him gently (because we love him):
              </p>
              <ul className="my-4 space-y-2 text-gray-700">
                <li>He can calculate the velocity of a bullet but still can't predict the trajectory of his own love life.</li>
                <li>Scored <strong>78/80 in science</strong> but somehow thought dating your best friend's crush was a "hypothesis worth testing."</li>
                <li>Claims to be focused at the <strong>shooting range</strong>… yet spends more time adjusting his hair in the reflection of the rifle scope.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-3xl font-semibold text-gray-900">The Complete Picture</h2>
              <p className="leading-relaxed text-gray-700">
                All jokes aside, <strong>Samar from Sree Gurukul School</strong> is clearly a <strong>multi-talented 10th grader</strong>—acing academics, exploring hobbies like <strong>shooting sports</strong>, and navigating the chaotic world of <strong>teenage romance</strong> with flair (and maybe a little chaos). Whether he's aiming for gold medals or green-eyed Jessicas, one thing's for sure: his story's far from over.
              </p>
              <p className="leading-relaxed text-gray-700">
                So here's to Samar—bullseye in exams, blurry lines in love, and always keeping us entertained!
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-3xl font-semibold text-gray-900">Key Highlights</h2>
              <div className="rounded-lg bg-gray-50 p-6">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Name:</strong> Samar Shanubhog</li>
                  <li><strong>School:</strong> Sree Gurukul School</li>
                  <li><strong>Grade:</strong> 10th Grade Student</li>
                  <li><strong>Academic Achievement:</strong> Science Topper - 78/80</li>
                  <li><strong>Hobbies:</strong> Shooting Range Practice, Sports</li>
                  <li><strong>Friends:</strong> Chinthan (shooting range buddy)</li>
                  <li><strong>Romance:</strong> Aditi (local interest), Jessica (Irish girlfriend)</li>
                  <li><strong>Notable For:</strong> Balancing academics, sports, and teenage romance</li>
                </ul>
              </div>
            </section>

            <section className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">About This Story</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                This blog post captures the memorable journey of <strong>Samar Shanubhog</strong>, a remarkable <strong>10th-grade student at Sree Gurukul School</strong> who has excelled academically with his <strong>science exam score of 78 out of 80</strong>. Beyond his academic prowess, Samar has explored <strong>shooting sports</strong> at the local range alongside his friend <strong>Chinthan</strong>, where he encountered <strong>Aditi</strong> in an interesting twist. His adventures have taken him internationally as well, with his relationship with <strong>Jessica, an Irish girl</strong>, showcasing the diverse experiences of <strong>Indian school student life</strong>. This <strong>teenage romance story</strong> intertwines academic excellence, sporting interests, friendship dynamics, and cross-cultural connections, making it a fascinating narrative of modern youth experiences.
              </p>
            </section>

            <footer className="mt-12 border-t border-gray-200 pt-8">
              <div className="text-sm text-gray-500">
                <p className="mb-2"><strong>Related Keywords:</strong></p>
                <p className="leading-relaxed">
                  Sree Gurukul School student, 10th grade science topper 78/80, shooting range practice with friends, teenage romance story, Chinthan and Aditi shooting range, dating an Irish girl Jessica, Indian school student life, academic excellence, shooting sports India, student achievements, international romance, school life stories, science examination success
                </p>
              </div>
            </footer>
          </div>
        </article>
      </main>
    </>
  )
}
