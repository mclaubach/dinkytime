# DinkyTime - Deployment Checklist

## Pre-Deployment Requirements

### Code Completeness
- [ ] All Phase 1 features implemented and working locally
- [ ] All TypeScript compilation errors resolved
- [ ] ESLint warnings addressed or documented
- [ ] No console.log statements in production code (or gated behind dev flag)
- [ ] All TODOs resolved or documented for Phase 2

### Testing Verification
- [ ] Manual testing checklist completed (see WORK_INSTRUCTIONS.md)
- [ ] Tested in Chrome (primary browser)
- [ ] Tested in Firefox (secondary browser)
- [ ] Tested in Safari (WebAudio compatibility check)
- [ ] Tested in Edge (Chromium consistency)
- [ ] Performance verified: 60 FPS during active jamming
- [ ] Audio latency confirmed: < 50ms keypress-to-sound
- [ ] Memory stable over 5+ minute sessions
- [ ] No crashes during extended testing

### Asset Preparation
- [ ] All sound effects collected and formatted correctly (MP3/WAV, mono, normalized)
- [ ] Sound files placed in `public/sounds/{animals,silly,percussion}/`
- [ ] Licensing verified for all audio samples (CC0, public domain, or proper attribution)
- [ ] Web fonts configured (Google Fonts CDN or self-hosted)
- [ ] Favicon created and added to public directory

### Build Verification
- [ ] Production build completes without errors: `npm run build`
- [ ] Build output inspected: files in `/dist` directory
- [ ] Production build tested locally: `npm run preview`
- [ ] Asset paths correct in production build
- [ ] No hardcoded localhost URLs or dev-only code

### Performance Optimization
- [ ] Vite build optimization verified (minification, tree-shaking)
- [ ] Large assets identified and optimized
- [ ] Initial load time < 3 seconds (test with throttled connection)
- [ ] Lazy loading considered for non-critical assets
- [ ] Source maps generated for debugging (optional)

---

## Cloudflare Pages Deployment

### Why Cloudflare Pages?
- **Free unlimited bandwidth** - No bandwidth or request limits
- **Global CDN** - Instant edge delivery worldwide
- **Zero cold starts** - Always-on, no spin-up time
- **Automatic HTTPS** - Required for Web Audio API
- **Git integration** - Deploy on push
- **Custom domains** - Easy setup with dinkytime.com
- **Instant rollbacks** - One-click revert to previous deployments

### Required Files
- [x] Production build in `/dist` directory
- [x] `package.json` with `build` script
- [ ] `.gitignore` includes: `node_modules/`, `dist/`, `.env`, `.DS_Store`

### Git Repository
- [ ] Git repository initialized: `git init`
- [ ] All files staged and committed: `git add . && git commit -m "..."`
- [ ] Repository clean: `git status` shows no uncommitted changes
- [ ] Repository pushed to GitHub/GitLab (for automatic deployments)

### Cloudflare Pages Setup (Option 1: Git Integration - Recommended)

1. **Connect Git Repository**
   - [ ] Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
   - [ ] Click "Create a project" → "Connect to Git"
   - [ ] Select your GitHub/GitLab account and repository
   - [ ] Authorize Cloudflare to access the repository

2. **Configure Build Settings**
   - [ ] **Build command**: `npm run build`
   - [ ] **Build output directory**: `dist`
   - [ ] **Root directory**: `/` (leave empty)
   - [ ] **Environment variables**: None needed for Phase 1
   - [ ] **Node.js version**: 20.x (auto-detected)

3. **Deploy**
   - [ ] Click "Save and Deploy"
   - [ ] Wait for build to complete (2-3 minutes)
   - [ ] Verify deployment at `<project-name>.pages.dev`

### Cloudflare Pages Setup (Option 2: Direct Upload - Quick Deploy)

```bash
# Build the site locally
npm run build

# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
npx wrangler login

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=dinkytime

# Follow prompts to create project if it doesn't exist
```

### Custom Domain Setup (dinkytime.com)

1. **Add Custom Domain**
   - [ ] Go to Pages project → Custom domains
   - [ ] Click "Set up a custom domain"
   - [ ] Enter `dinkytime.com`
   - [ ] Add `www.dinkytime.com` as well (optional)

2. **Configure DNS** (if domain is on Cloudflare DNS)
   - [ ] Cloudflare will automatically add CNAME records
   - [ ] Wait for DNS propagation (usually instant, max 24 hours)
   - [ ] Verify at https://dinkytime.com

3. **Configure DNS** (if domain is elsewhere)
   - [ ] Add CNAME record: `dinkytime.com` → `<project-name>.pages.dev`
   - [ ] Add CNAME record: `www.dinkytime.com` → `<project-name>.pages.dev`
   - [ ] Wait for DNS propagation (5 minutes - 24 hours)

---

## Post-Deployment Verification

### Functionality Testing
- [ ] App loads at production URL without errors
- [ ] Landing modal appears correctly
- [ ] "START JAM" button works (audio context initializes)
- [ ] Keypresses trigger sounds and visuals
- [ ] Canvas fills with elements as expected
- [ ] Shader effects apply correctly
- [ ] Escape key hold (5s) exits jam session
- [ ] Review modal appears after exit
- [ ] Replay button recreates session accurately
- [ ] Download canvas button produces PNG file
- [ ] Download audio button produces audio file (WebM)
- [ ] "START NEW JAM" resets and begins new session

### Browser Compatibility (Production)
- [ ] Works in Chrome on desktop
- [ ] Works in Firefox on desktop
- [ ] Works in Safari on macOS
- [ ] Works in Edge on Windows
- [ ] Mobile behavior acceptable (or displays message about keyboard requirement)

### Performance (Production)
- [ ] Page loads in < 3 seconds on standard connection
- [ ] 60 FPS maintained during jamming
- [ ] Audio plays without crackling or dropouts
- [ ] No memory leaks over 10-minute session
- [ ] localStorage saves sessions correctly

### Error Handling (Production)
- [ ] HTTPS enforced (automatic with Cloudflare Pages)
- [ ] Audio context starts correctly after user gesture
- [ ] WebGL fallback works if unavailable (shader effects disabled)
- [ ] localStorage quota errors handled gracefully
- [ ] Asset loading failures have fallbacks (synth-only mode)
- [ ] MediaRecorder unavailable: visual-only session works

### Browser Console
- [ ] No JavaScript errors in console
- [ ] No 404 errors for assets
- [ ] No CORS errors
- [ ] Only intentional warnings (if any)

---

## Monitoring & Maintenance

### Cloudflare Pages Dashboard
- [ ] Deployment status: "Success"
- [ ] Build logs reviewed for any warnings
- [ ] Analytics enabled (optional, privacy-respecting)
- [ ] Preview deployments working for branches

### Continuous Deployment
- [ ] Push to main/master triggers automatic deployment
- [ ] Preview deployments created for pull requests
- [ ] Build notifications configured (email/Slack)

### User Feedback Channels
- [ ] Way for users to report issues (GitHub, email, etc.)
- [ ] Plan for monitoring user feedback
- [ ] Documentation for common issues (FAQ in README)

### Backup & Rollback Plan
- [ ] Git commit tagged with version: `git tag v1.0.0`
- [ ] Rollback available via Cloudflare dashboard (one-click)
- [ ] Previous deployments accessible for comparison

---

## Optional Enhancements (Phase 1.5)

### Analytics (Privacy-Respecting)
- [ ] Cloudflare Web Analytics (privacy-first, no cookies)
- [ ] Page view tracking
- [ ] Basic performance metrics

### Performance Monitoring
- [ ] Cloudflare's built-in performance metrics
- [ ] Track load times and errors
- [ ] Identify bottlenecks for optimization

### SEO & Meta Tags
- [ ] Open Graph tags for social media sharing
- [ ] Twitter Card meta tags
- [ ] Descriptive page title and meta description
- [ ] Favicon configured

### Security Headers (Automatic with Cloudflare Pages)
- [x] HTTPS everywhere
- [x] Automatic security headers
- [ ] Custom headers if needed (via `_headers` file)

---

## Known Limitations (Document for Users)

### Phase 1 Constraints
- Browser localStorage only (no cloud storage)
- Max 5 sessions saved locally
- No user accounts or social features
- Keyboard required (no mobile touch support)
- Audio export: WebM format only (browser-dependent)
- MediaRecorder API required for audio recording (no fallback format)

### Browser Requirements
- Modern browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- JavaScript enabled
- Web Audio API support
- WebGL support (optional, for shader effects)
- localStorage enabled

---

## Phase 2 Planning

### Future Deployment Needs
- [ ] Backend API hosting (Cloudflare Workers or separate service)
- [ ] Database setup (D1, Supabase, or PostgreSQL)
- [ ] Image/audio storage (Cloudflare R2, S3, or Cloudinary)
- [ ] User authentication (Auth0, Firebase, or Cloudflare Access)
- [ ] Session storage and retrieval API
- [ ] Gallery/feed pagination and filtering

---

## Troubleshooting

### Common Deployment Issues

**Build Fails on Cloudflare Pages**
- Check Node.js version (should be 20.x)
- Verify all dependencies in `package.json`
- Review build logs in Cloudflare dashboard
- Test build locally: `npm run build`
- Ensure no relative imports outside src directory

**App Loads But Blank Page**
- Check browser console for errors
- Verify build output in `/dist` has `index.html`
- Check asset paths are relative (not absolute)
- Ensure Vite build completed successfully

**Static Files Not Found (404)**
- Verify assets in `/dist` directory after build
- Check file paths are case-sensitive
- Ensure `public/` folder contents copied to `/dist`
- Clear Cloudflare cache if needed

**Audio Not Working**
- Verify HTTPS (automatic with Cloudflare Pages)
- Check browser console for Web Audio errors
- Ensure `Tone.start()` called on user gesture
- Test in different browsers

**WebGL Errors**
- Check shader compilation errors in console
- Verify Three.js version compatibility
- Fallback to no-shader mode if needed

**localStorage Quota Exceeded**
- Implement session cleanup (keep only last 5)
- Warn user and continue without saving
- Consider alternative storage in Phase 2

**Deployment Not Updating**
- Check git push went through
- Verify webhook triggered in Cloudflare
- Clear browser cache (hard refresh)
- Check deployment status in dashboard

---

## Success Criteria

✅ App deployed and accessible at dinkytime.com  
✅ All core features working in production  
✅ No critical errors in browser console  
✅ Performance meets targets (60 FPS, <50ms latency)  
✅ Cross-browser compatibility verified  
✅ User can complete full jam session flow  
✅ Sessions can be replayed accurately  
✅ Downloads work (canvas PNG, audio WebM)  
✅ Documentation complete and accurate  

---

## Post-Launch

### Share & Promote
- [ ] Share URL with friends/family for testing
- [ ] Post on social media (if desired)
- [ ] Share in relevant communities (Reddit, Discord, etc.)
- [ ] Gather user feedback

### Iterate
- [ ] Log issues and feature requests
- [ ] Prioritize fixes vs. Phase 2 features
- [ ] Plan next iteration based on feedback

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Production URL**: https://dinkytime.com  
**Cloudflare Project**: dinkytime  
**Git Commit**: ___________  
**Version**: Phase 1.0.0  

---

Remember: Phase 1 is about **getting it working and deployed**. Perfection comes with iteration. Ship it! 🚀
