# Redeploys this site to Cloudflare Pages.
# Run this from the project folder any time you add images or edit pages:
#   .\deploy.ps1

$ErrorActionPreference = "Stop"

$deployDir = Join-Path $env:TEMP "tbone-portfolio-deploy"
if (Test-Path $deployDir) { Remove-Item -Recurse -Force $deployDir }
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Everything the live site needs. Deliberately excludes .claude/ (local dev
# config) and anything else sitting in this folder that isn't part of the site.
$items = @(
    "README.md", "about-me.html", "contact.html", "css", "index.html",
    "journal", "journal.html", "journal.json", "js", "media",
    "projects", "projects.html", "projects.json", "qualities.txt"
)
foreach ($item in $items) {
    Copy-Item -Recurse -Path $item -Destination $deployDir
}

wrangler pages deploy $deployDir --project-name=tbone-portfolio --commit-message="Update via deploy.ps1" --commit-dirty=true
