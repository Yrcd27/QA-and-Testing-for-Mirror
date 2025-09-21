# Image Placeholder Directory

This directory is for storing screenshots of your Jira or Bugzilla implementation.

## Required Screenshots

To properly document your use of an issue tracking system, you should add the following screenshots to this directory:

1. `jira-bug-001.png` - Screenshot of the JWT Token bug in Jira
2. `jira-bug-002.png` - Screenshot of the XSS Vulnerability bug in Jira
3. `jira-bug-003.png` - Screenshot of the Database Connection Timeout bug in Jira
4. `jira-rca-001.png` - Screenshot of the root cause analysis for the JWT Token bug
5. `jira-dashboard.png` - Screenshot of your Jira dashboard showing bug metrics
6. `jira-board.png` - Screenshot of your Jira Agile/Kanban board

## How to Create These Screenshots

1. Sign up for a free Jira Software Cloud account at https://www.atlassian.com/software/jira/free
2. Create a new project for your Mirror application QA testing
3. Create the bug tickets based on the content in `bug-reports.md`
4. Add root cause analysis as described in `root-cause-analysis.md`
5. Take screenshots of each item and save them with the filenames listed above
6. Place all screenshots in this directory

## Alternative: Using Bugzilla

If you prefer to use Bugzilla instead of Jira:
1. Use a public Bugzilla instance like Mozilla's test instance
2. Create similar bug reports and take screenshots
3. Name the files accordingly (e.g., `bugzilla-bug-001.png` etc.)

Remember to update the paths in the `jira-implementation-evidence.md` file to match your actual screenshot filenames.