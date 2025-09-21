# OWASP Top 10 (2021) Quick Reference Guide

This guide provides a brief overview of the OWASP Top 10 Web Application Security Risks (2021) and how they apply to our Mirror application.

## 1. A01:2021 – Broken Access Control

**Description**: Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of data.

**Examples**:
- Bypassing access control checks by modifying the URL
- Permitting viewing or editing someone else's account
- Elevation of privilege
- Metadata manipulation (JWT tampering)

**Mirror App Vulnerability**: 
- Permissive CORS configuration allowing any origin to access the API
- Hardcoded API URLs with no centralized access control

**Fix Implementation**: 
- Whitelist-based CORS policy
- Centralized API configuration with proper access controls
- Rate limiting to prevent API abuse

## 2. A02:2021 – Cryptographic Failures

**Description**: Failures related to cryptography that often lead to exposure of sensitive data.

**Examples**:
- Transmitting sensitive data in clear text
- Using weak cryptographic algorithms
- Using default or weak keys
- Not enforcing encryption

**Prevention**:
- Encrypt all sensitive data at rest and in transit
- Use strong, updated algorithms and protocols
- Store passwords with strong adaptive hashing functions
- Disable caching for responses with sensitive data

## 3. A03:2021 – Injection

**Description**: User-supplied data is not validated, filtered, or sanitized by the application.

**Examples**:
- SQL injection
- NoSQL injection
- OS command injection
- Cross-site scripting (XSS)

**Prevention**:
- Use a safe API that avoids interpreter use
- Use positive server-side input validation
- Use parameterized queries for SQL
- Sanitize all user inputs

## 4. A04:2021 – Insecure Design

**Description**: Flaws in design and architecture, distinct from implementation errors.

**Examples**:
- Missing critical business limits
- Poor threat modeling
- Insecure business flows

**Prevention**:
- Establish secure development lifecycle
- Use threat modeling for critical authentication and access control
- Integrate security language and controls into user stories

## 5. A05:2021 – Security Misconfiguration

**Description**: Improper implementation of controls intended to keep application data safe.

**Examples**:
- Incomplete configurations
- Open cloud storage
- Misconfigured HTTP headers
- Default accounts and passwords

**Prevention**:
- Hardened configuration process
- Minimal platform with only necessary features
- Review and update configurations regularly
- Segmented application architecture

## 6. A06:2021 – Vulnerable and Outdated Components

**Description**: Using components with known vulnerabilities.

**Examples**:
- Outdated or unsupported software
- Not scanning for vulnerabilities regularly
- Not fixing or upgrading underlying platform, frameworks, and dependencies

**Prevention**:
- Remove unused dependencies
- Continuously inventory components and their versions
- Monitor for vulnerabilities in components
- Only obtain components from official sources

## 7. A07:2021 – Identification and Authentication Failures

**Description**: Confirmation of the user's identity, authentication, and session management is critical to protect against authentication-related attacks.

**Examples**:
- Permitting brute force attacks
- Permitting weak passwords
- Using ineffective credential recovery
- Storing passwords in plain text

**Mirror App Vulnerability**:
- Basic JWT implementation with no refresh mechanism
- Weak password requirements
- No protection against brute force attacks

**Fix Implementation**:
- Secure JWT implementation with refresh tokens
- Enhanced password requirements
- Rate limiting for authentication endpoints
- Secure token storage with HTTP-only cookies

## 8. A08:2021 – Software and Data Integrity Failures

**Description**: Code and infrastructure that does not protect against integrity violations.

**Examples**:
- Using plugins from untrusted sources
- Auto-update functionality without integrity verification
- CI/CD pipeline without proper security controls

**Prevention**:
- Use digital signatures to verify software or data authenticity
- Ensure dependencies are from trusted repositories
- Review code and configuration changes
- Ensure CI/CD pipeline has proper segregation and configuration

## 9. A09:2021 – Security Logging and Monitoring Failures

**Description**: Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response.

**Examples**:
- Auditable events not logged
- Logs not monitored for suspicious activity
- Alerts absent or ineffective

**Prevention**:
- Log all login, access control, and server-side input validation failures
- Ensure logs are in format that can be consumed by log management solutions
- Establish effective monitoring and alerting

## 10. A10:2021 – Server-Side Request Forgery (SSRF)

**Description**: SSRF flaws occur when a web application fetches a remote resource without validating the user-supplied URL.

**Examples**:
- Application fetches URL provided by user without validation
- Attacker can force application to send crafted requests to unexpected destinations

**Prevention**:
- Sanitize and validate all client-supplied input data
- Enforce URL schema, port, and destination with a positive allow list
- Disable HTTP redirections
- Be aware of URL consistency to prevent DNS rebinding attacks

## Additional Resources

- [OWASP Top 10 - 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)