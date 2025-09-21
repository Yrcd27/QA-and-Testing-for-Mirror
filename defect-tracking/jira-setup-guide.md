# Step-by-Step Guide: Implementing Jira for Bug Tracking

This guide will walk you through the process of setting up Jira Software Cloud for tracking bugs in your Mirror application project.

## Step 1: Sign Up for Jira Software Cloud

1. Go to https://www.atlassian.com/software/jira/free
2. Click "Sign up for free"
3. Create an account using your email address
4. Complete the registration process

## Step 2: Create a New Jira Project

1. After logging in, click "Create Project"
2. Select "Software Development" as the project type
3. Choose "Scrum" as the methodology
4. Name your project "Mirror Application QA"
5. Enter "MIRR" as the project key
6. Click "Create Project"

## Step 3: Configure Project Settings

1. Go to Project Settings (gear icon) > Issue Types
2. Ensure you have the following issue types:
   - Bug
   - Task
   - Story
   - Epic
3. Go to Project Settings > Workflows
4. Verify the workflow includes these statuses:
   - To Do
   - In Progress
   - Review
   - Done

## Step 4: Create Custom Fields

1. Go to Project Settings > Fields
2. Add a custom field called "Severity" with options:
   - Critical
   - Major
   - Minor
3. Add a custom field called "Environment" (text field)
4. Add a custom field called "Steps to Reproduce" (paragraph field)
5. Add a custom field called "Expected Result" (paragraph field)
6. Add a custom field called "Actual Result" (paragraph field)

## Step 5: Create Bug MIRR-001 (JWT Token Issue)

1. Click "Create" in the top navigation
2. Select issue type "Bug"
3. Enter summary: "JWT Token Not Refreshing Properly Leading to Premature Session Expiry"
4. Set Priority: Highest
5. Set Severity: Critical
6. Fill in Description using the content from `bug-reports.md`
7. Fill in Steps to Reproduce, Expected Result, and Actual Result fields
8. Add relevant labels: "authentication", "security", "session-management"
9. Click "Create"

## Step 6: Create Bug MIRR-002 (XSS Vulnerability)

1. Click "Create" in the top navigation
2. Select issue type "Bug"
3. Enter summary: "Cross-Site Scripting (XSS) Vulnerability in Journal Entry Comments"
4. Set Priority: High
5. Set Severity: Major
6. Fill in Description using the content from `bug-reports.md`
7. Fill in Steps to Reproduce, Expected Result, and Actual Result fields
8. Add relevant labels: "security", "xss", "journal-module"
9. Click "Create"

## Step 7: Create Bug MIRR-003 (Database Connection Timeout)

1. Click "Create" in the top navigation
2. Select issue type "Bug"
3. Enter summary: "Database Connection Timeout During High User Load"
4. Set Priority: High
5. Set Severity: Major
6. Fill in Description using the content from `bug-reports.md`
7. Fill in Steps to Reproduce, Expected Result, and Actual Result fields
8. Add relevant labels: "performance", "database", "scalability"
9. Click "Create"

## Step 8: Document Root Cause Analysis

1. Click "Create" in the top navigation
2. Select issue type "Task"
3. Enter summary: "Root Cause Analysis: JWT Token Refresh Issue"
4. Link this task to MIRR-001 using the "relates to" link type
5. Add the root cause analysis content from `root-cause-analysis.md` to the description
6. Include code examples and prevention strategies
7. Click "Create"

## Step 9: Update Bug Statuses and Add Comments

1. Open MIRR-001
2. Add comments documenting the investigation process:
   - Comment 1: "Initial investigation shows issues with token refresh mechanism"
   - Comment 2: "Root cause identified - refresh token stored insecurely and refresh endpoint has implementation flaws"
   - Comment 3: "Fix implemented and pushed to development branch" (with details)
3. Move the issue through the workflow:
   - Change status to "In Progress"
   - Later change to "Review"
   - Finally change to "Done"
4. Repeat for the other bugs with appropriate comments and statuses

## Step 10: Create a Dashboard

1. Click "Dashboards" in the top navigation
2. Click "Create dashboard"
3. Name it "Mirror QA Bug Tracking"
4. Add gadgets to the dashboard:
   - Filter Results gadget showing bugs by severity
   - Pie Chart showing bugs by status
   - Recently Created Issues gadget
   - Resolution Time gadget

## Step 11: Take Screenshots for Documentation

1. Take screenshots of:
   - MIRR-001 full ticket
   - MIRR-002 full ticket
   - MIRR-003 full ticket
   - Root Cause Analysis task
   - Dashboard
   - Jira board showing all tickets
2. Save the screenshots in the `defect-tracking/images` directory
3. Update the `jira-implementation-evidence.md` file with the actual screenshots

## Step 12: Prepare for Demonstration

1. Ensure you can log in to Jira during your viva
2. Practice navigating through the bugs, showing their details
3. Be ready to explain:
   - How you set up the Jira project
   - How you classified bug severity
   - How you documented the root cause analysis
   - How you would track these bugs through to resolution

## Additional Tips

- If you're a student, you can use Jira Software for free with the Academic License
- You can invite team members to your Jira project for collaborative bug tracking
- Use the Jira mobile app to access your bug reports on the go
- Consider adding the Jira URL to your presentation materials