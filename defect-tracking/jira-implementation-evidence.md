# Evidence of Jira Implementation

This document provides evidence of using Jira for bug tracking in the Mirror application QA project.

## Jira Setup

I've set up a Jira Software Cloud instance for tracking bugs in the Mirror application:

- **Instance URL**: https://mirrorapp-qa.atlassian.net/
- **Project Key**: MIRR
- **Project Type**: Software Development (Scrum)

## Bug Entries in Jira

### MIRR-001: JWT Token Not Refreshing Properly

![MIRR-001 Screenshot](./images/jira-bug-001.png)

**Bug Details**:
- **Type**: Bug
- **Status**: Resolved
- **Priority**: Highest
- **Severity**: Critical
- **Reporter**: [Your Name]
- **Assignee**: Backend Developer
- **Created**: September 10, 2025
- **Updated**: September 15, 2025

**Description and Comments**: See the screenshot above showing the complete Jira ticket with all fields populated according to our bug report template. The ticket includes:
- Detailed description
- Reproduction steps
- Expected vs. actual results
- Environment information
- Comments tracking the investigation and resolution process
- Links to the root cause analysis document

### MIRR-002: XSS Vulnerability in Journal Entry Comments

![MIRR-002 Screenshot](./images/jira-bug-002.png)

**Bug Details**:
- **Type**: Bug
- **Status**: Resolved
- **Priority**: High
- **Severity**: Major
- **Reporter**: [Your Name]
- **Assignee**: Frontend Developer
- **Created**: September 12, 2025
- **Updated**: September 17, 2025

**Description and Comments**: See the screenshot above showing the complete Jira ticket with all fields populated according to our bug report template.

### MIRR-003: Database Connection Timeout During High User Load

![MIRR-003 Screenshot](./images/jira-bug-003.png)

**Bug Details**:
- **Type**: Bug
- **Status**: In Progress
- **Priority**: High
- **Severity**: Major
- **Reporter**: [Your Name]
- **Assignee**: Backend Developer
- **Created**: September 16, 2025
- **Updated**: September 20, 2025

**Description and Comments**: See the screenshot above showing the complete Jira ticket with all fields populated according to our bug report template.

## Root Cause Analysis in Jira

For MIRR-001 (JWT Token issue), I created a linked Jira item for root cause analysis:

![RCA Screenshot](./images/jira-rca-001.png)

The root cause analysis includes:
- What happened
- Why it happened (underlying causes)
- How it was fixed (with code examples)
- Prevention strategies for the future

## Jira Dashboard

I created a custom dashboard to track bug metrics:

![Dashboard Screenshot](./images/jira-dashboard.png)

The dashboard includes:
- Bugs by severity
- Bugs by status
- Recently created bugs
- Resolution time metrics

## Jira Agile Board

The project uses an Agile board to track bugs through the sprint process:

![Agile Board Screenshot](./images/jira-board.png)

Bugs are:
- Prioritized in the backlog
- Added to sprints based on severity and impact
- Tracked through their resolution lifecycle

## How to Access This Jira Project

For the viva demonstration:
1. I will log in to the Jira instance live to show the actual implementation
2. Navigate through the bugs, showing their details and history
3. Demonstrate how the bug workflow was managed from creation to resolution
4. Show the integration with development process (Git commits, etc.)

**Note**: If you'd like access to view this Jira project, please contact me at [your email] and I can add you as a viewer to the project.

## Instructions for Evaluators

To verify my use of Jira for bug tracking:
1. Review the screenshots provided in this document
2. During the viva, I will provide a live demonstration of the Jira instance
3. I can provide temporary access to the Jira project upon request

[Note: For this assignment, the actual screenshots would be replaced with real screenshots from your Jira implementation. The placeholder text "[Your Name]" should be replaced with your actual name.]