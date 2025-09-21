# Using Issue Trackers for Defect Management

This guide explains how to implement the defect tracking process documented in this folder using actual issue tracking software like Jira or Bugzilla.

## Jira Setup and Configuration

### Project Setup

1. **Create a new project** in Jira:
   - Project name: Mirror Application QA
   - Project key: MIRR
   - Project type: Software Development

2. **Configure issue types**:
   - Bug: For tracking defects
   - Epic: For grouping related bugs (e.g., "Security Enhancements")
   - Story: For tracking new features or improvements
   - Task: For other work items

3. **Create custom fields**:
   - Root Cause: Dropdown (Code Issue, Configuration, Database, External Dependency, etc.)
   - Testing Type: Dropdown (Unit, Integration, Security, Performance, etc.)
   - Environment: Dropdown (Development, Staging, Production)

4. **Set up workflows**:
   - New → Open → In Progress → Fixed → Verification → Closed
   - With additional transitions for Reopened and Won't Fix

### Issue Templates

Create issue templates with the following sections:

1. **Bug Template**:
   ```
   h2. Description
   [Detailed description of the issue]
   
   h2. Steps to Reproduce
   # Step 1
   # Step 2
   # Step 3
   
   h2. Expected Result
   [What should happen]
   
   h2. Actual Result
   [What actually happens]
   
   h2. Environment
   * Browser: 
   * OS: 
   * Version: 
   
   h2. Screenshots/Evidence
   [Attach relevant screenshots or logs]
   ```

2. **Root Cause Analysis Template**:
   ```
   h2. Problem Statement
   [Clear definition of the issue]
   
   h2. Impact Assessment
   [Scope and effect on users and system]
   
   h2. Investigation
   [Deep dive into code, logs, and system behavior]
   
   h2. Root Cause
   [Determination of the fundamental cause]
   
   h2. Solution
   [Comprehensive fix addressing the root cause]
   
   h2. Prevention Strategy
   [Measures to prevent similar issues]
   ```

### Dashboard and Reports

Configure the following dashboards and reports:

1. **Bug Tracking Dashboard**:
   - Bugs by Priority: Pie chart
   - Bugs by Status: Status board
   - Recently Created Bugs: List
   - My Assigned Bugs: List
   - Time to Resolution: Line chart

2. **Sprint Bug Report**:
   - New bugs found in sprint
   - Bugs resolved in sprint
   - Bug fix success rate
   - Aging bugs (older than 2 sprints)

## Bugzilla Setup and Configuration

### Project Setup

1. **Create a new product** in Bugzilla:
   - Product name: Mirror Application
   - Description: MERN stack application for journaling

2. **Configure components**:
   - Frontend
   - Backend
   - Database
   - Authentication
   - Journal Module
   - User Profile Module

3. **Set up bug status lifecycle**:
   - UNCONFIRMED → NEW → ASSIGNED → IN_PROGRESS → RESOLVED → VERIFIED → CLOSED

### Custom Fields

Create the following custom fields:

1. **Root Cause**: Dropdown field
2. **Testing Phase**: When the bug was found
3. **Test Case ID**: Reference to test case that found the bug
4. **Fix Version**: Version where the fix will be included

### Bugzilla Queries

Create saved queries for common bug reports:

1. **Critical Bugs**: All bugs with severity Critical
2. **Current Sprint Bugs**: All bugs targeted for current sprint
3. **Recently Reported**: Bugs reported in the last 7 days
4. **Ready for Verification**: Bugs marked as RESOLVED waiting for QA

## Integration with Development Process

### Git Integration

1. **Branch naming convention**:
   - `fix/MIRR-123-short-description` for bug fixes
   - Where MIRR-123 is the Jira issue key

2. **Commit message format**:
   ```
   MIRR-123: Fix JWT token refresh mechanism
   
   - Updated token storage to use HttpOnly cookies
   - Implemented proper token validation
   - Added token rotation on refresh
   ```

3. **Pull request templates**:
   ```
   ## Bug Fix
   
   Jira Issue: MIRR-123
   
   ### Changes Made
   - [List changes]
   
   ### How Was It Tested
   - [List testing steps]
   
   ### Checklist
   - [ ] Unit tests added/updated
   - [ ] Integration tests passed
   - [ ] No new linting issues
   - [ ] Documentation updated
   ```

### CI/CD Integration

1. **Automated testing**:
   - Run unit tests for all bug fixes
   - Add regression tests for critical bugs
   - Security scanning for security-related fixes

2. **Jira status updates**:
   - Update Jira issue status based on PR status
   - Add build and test results to Jira issues
   - Automatic transition to Verification when PR is merged

## Sample Bug Tracking in Action

### Example: JWT Token Issue (BUG-001)

1. **Bug Discovery**:
   - QA tester notices users getting logged out unexpectedly
   - Creates a new bug in Jira with severity Critical
   - Attaches screenshots and console errors

2. **Triage**:
   - Bug verified and assigned to backend developer
   - Added to current sprint due to severity
   - Linked to "Authentication Improvements" epic

3. **Investigation**:
   - Developer investigates and updates issue with findings
   - Root cause identified (incorrect token refresh mechanism)
   - Solution proposed in Jira comments

4. **Resolution**:
   - Developer creates branch `fix/MIRR-001-jwt-token-refresh`
   - Implements fixes and adds tests
   - Creates PR with reference to Jira issue

5. **Verification**:
   - QA tests the fix in development environment
   - Verifies the issue is resolved
   - Updates Jira status to Verified

6. **Closure**:
   - Bug included in release notes for v1.5.3
   - Closed after successful deployment
   - RCA document linked to Jira issue

## Mapping Files to Jira/Bugzilla

The files in this folder correspond to Jira/Bugzilla components as follows:

| File | Issue Tracker Equivalent |
|------|--------------------------|
| bug-reports.md | Individual Jira/Bugzilla tickets |
| root-cause-analysis.md | RCA document attached to Jira issue |
| jira-ticket-examples.md | How bugs would appear in Jira |
| bug-submission-process.md | Process documentation in Confluence/Wiki |
| demonstration-guide.md | Training material for team onboarding |

## Getting Started with Jira

To start using Jira for bug tracking:

1. **Sign up** for Jira Software (Cloud or Server)
2. **Create a project** following the setup guidelines above
3. **Configure** issue types, workflows, and fields
4. **Create issue templates** for consistent bug reporting
5. **Set up dashboards** for monitoring bug status
6. **Integrate with development tools** (Git, CI/CD)

## Getting Started with Bugzilla

To start using Bugzilla for bug tracking:

1. **Install Bugzilla** on a server or use hosted solution
2. **Configure the product** and components
3. **Set up custom fields** for tracking bug metadata
4. **Create saved searches** for common bug reports
5. **Configure email notifications** for bug updates
6. **Add users** and assign appropriate permissions