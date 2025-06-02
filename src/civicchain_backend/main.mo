import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Char "mo:base/Char";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor CivicChain {
    // Types
    public type UserRole = {
        #Citizen;
        #Police;
        #BarangayOfficial;
        #HeadPolice;
        #HeadBarangay;
    };

    public type ReportStatus = {
        #Submitted;
        #UnderReview;
        #InProgress;
        #Resolved;
        #Escalated;
    };

    public type ReportType = {
        #Pothole;
        #Theft;
        #Corruption;
        #TrafficViolation;
        #NoiseComplaint;
        #StreetLight;
        #Garbage;
        #Other: Text;
    };

    public type Location = {
        latitude: Float;
        longitude: Float;
        address: Text;
        barangay: Text;
    };

    public type Report = {
        id: Text;
        title: Text;
        description: Text;
        reportType: ReportType;
        location: Location;
        status: ReportStatus;
        submittedBy: Text; // User ID
        assignedTo: ?Text; // Police/Barangay Official ID
        createdAt: Int;
        updatedAt: Int;
        mediaUrls: [Text];
        isAnonymous: Bool;
    };

    public type User = {
        id: Text;
        role: UserRole;
        name: Text;
        email: Text;
        passwordHash: Text; // Store password hash, not plaintext
        phoneNumber: Text; // Added phone number field
        idNumber: ?Text; // Added ID number field (optional for citizens)
        department: ?Text; // For police
        barangay: ?Text; // For barangay officials
        isActive: Bool;
        createdAt: Int;
    };

    public type Proposal = {
        id: Text;
        title: Text;
        description: Text;
        proposedBy: Text; // User ID
        barangay: Text;
        budget: Nat;
        status: {#Pending; #Approved; #Rejected; #InProgress; #Completed};
        votes: [(Text, Bool)]; // User ID, vote (true = yes, false = no)
        createdAt: Int;
        deadline: Int;
    };

    public type Announcement = {
        id: Text;
        title: Text;
        content: Text;
        author: Text; // User ID
        targetAudience: {#All; #Barangay: Text; #Police};
        createdAt: Int;
        isActive: Bool;
    };

    // Manila Barangays (sample list - can be expanded)
    private let manilaBarangays = [
        "Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5",
        "Barangay 6", "Barangay 7", "Barangay 8", "Barangay 9", "Barangay 10",
        "Barangay 11", "Barangay 12", "Barangay 13", "Barangay 14", "Barangay 15",
        "Barangay 16", "Barangay 17", "Barangay 18", "Barangay 19", "Barangay 20",
        "Ermita", "Intramuros", "Malate", "Paco", "Pandacan", "Port Area",
        "Quiapo", "Sampaloc", "San Andres", "San Miguel", "San Nicolas",
        "Santa Ana", "Santa Cruz", "Santa Mesa", "Tondo", "Binondo"
    ];

    // Police Stations in Manila
    private let policeStations = [
        "Manila Police District - Station 1 (Intramuros)",
        "Manila Police District - Station 2 (Ermita)",
        "Manila Police District - Station 3 (Malate)",
        "Manila Police District - Station 4 (Paco)",
        "Manila Police District - Station 5 (Pandacan)",
        "Manila Police District - Station 6 (Quiapo)",
        "Manila Police District - Station 7 (Sampaloc)",
        "Manila Police District - Station 8 (San Miguel)",
        "Manila Police District - Station 9 (Santa Ana)",
        "Manila Police District - Station 10 (Santa Cruz)",
        "Manila Police District - Station 11 (Tondo)",
        "Manila Police District - Station 12 (Binondo)"
    ];

    // State
    private stable var nextReportId: Nat = 1;
    private stable var nextUserId: Nat = 1;
    private stable var nextProposalId: Nat = 1;
    private stable var nextAnnouncementId: Nat = 1;

    private var reports = HashMap.HashMap<Text, Report>(10, Text.equal, Text.hash);
    private var users = HashMap.HashMap<Text, User>(10, Text.equal, Text.hash);
    private var proposals = HashMap.HashMap<Text, Proposal>(10, Text.equal, Text.hash);
    private var announcements = HashMap.HashMap<Text, Announcement>(10, Text.equal, Text.hash);

    // Helper functions
    private func generateId(prefix: Text, counter: Nat): Text {
        prefix # Int.toText(counter)
    };

    // Simple password hashing function (for demonstration - in production use a proper hashing library)
    private func hashPassword(password: Text): Text {
        var hash: Nat32 = 0;
        for (char in password.chars()) {
            let charCode = Char.toNat32(char);
            hash := hash +% charCode;
            hash := hash *% 31;
        };
        Nat32.toText(hash)
    };

    // User Management
    public func registerUser(
    name: Text, 
    email: Text, 
    password: Text, 
    role: UserRole, 
    department: ?Text, 
    barangay: ?Text,
    phoneNumber: Text,
    idNumber: ?Text
    ): async Result.Result<Text, Text> {
    
    let normalizedEmail = Text.toLowercase(email);

    // Check if email already exists
    let existingUser = Array.find(
        Iter.toArray(users.vals()), 
        func(u: User): Bool { Text.toLowercase(u.email) == normalizedEmail }
    );
    
    if (existingUser != null) {
        return #err("Email already registered");
    };

    // Validate phone number format: Must be 11 digits and start with "09"
    if (not Text.startsWith(phoneNumber, #text("09")) or Text.size(phoneNumber) != 11) {
        return #err("Invalid phone number. It must start with '09' and be 11 digits.");
    };

    // Role-specific ID validation
    switch (role) {
        case (#Police) {
            switch (idNumber) {
                case null { return #err("Police ID number is required."); };
                case (?id) {
                    if (not Text.startsWith(id, #text("MPD-")) or Text.size(id) != 9) {
                        return #err("Invalid Police ID format. Must be 'MPD-12345'");
                    };
                };
            };
        };
        case (#BarangayOfficial) {
            switch (idNumber) {
                case null { return #err("Barangay ID number is required."); };
                case (?id) {
                    if (not Text.startsWith(id, #text("BRGY-")) or Text.size(id) != 10) {
                        return #err("Invalid Barangay ID format. Must be 'BRGY-12345'");
                    };
                };
            };
        };
        case (_) {}; // No ID validation for other roles
    };

    let userId = generateId("user_", nextUserId);
    nextUserId += 1;

    let passwordHash = hashPassword(password);

    let newUser: User = {
        id = userId;
        role = role;
        name = name;
        email = normalizedEmail;
        passwordHash = passwordHash;
        phoneNumber = phoneNumber;
        idNumber = idNumber;
        department = department;
        barangay = barangay;
        isActive = true;
        createdAt = Time.now();
    };

    users.put(userId, newUser);

    #ok(userId)
    };


    public query func getUser(userId: Text): async ?User {
        users.get(userId)
    };

    public query func getAllUsers(): async [User] {
        Iter.toArray(users.vals())
    };

    public query func getManilaBarangays(): async [Text] {
        manilaBarangays
    };

    public query func getPoliceStations(): async [Text] {
        policeStations
    };

    public func login(email: Text, password: Text, role: UserRole): async Result.Result<User, Text> {
        // Find user by email or ID number based on role
        let userOpt = switch (role) {
            case (#Police) {
                // For police, try to find by ID number first (MPD-XXXXX)
                if (Text.startsWith(email, #text("MPD-"))) {
                    Array.find(Iter.toArray(users.vals()), func(u: User): Bool { 
                        switch (u.idNumber) {
                            case (?id) { id == email };
                            case (null) { false };
                        }
                    })
                } else {
                    // If not an ID number, search by email
                    Array.find(Iter.toArray(users.vals()), func(u: User): Bool { u.email == email })
                }
            };
            case (#BarangayOfficial) {
                // For barangay officials, try to find by ID number first (BRGY-XXXXX)
                if (Text.startsWith(email, #text("BRGY-"))) {
                    Array.find(Iter.toArray(users.vals()), func(u: User): Bool { 
                        switch (u.idNumber) {
                            case (?id) { id == email };
                            case (null) { false };
                        }
                    })
                } else {
                    // If not an ID number, search by email
                    Array.find(Iter.toArray(users.vals()), func(u: User): Bool { u.email == email })
                }
            };
            case (_) {
                // For citizens, only search by email
                Array.find(Iter.toArray(users.vals()), func(u: User): Bool { u.email == email })
            };
        };
        
        switch (userOpt) {
            case (null) {
                #err("User not found")
            };
            case (?user) {
                // Check if password matches
                let passwordHash = hashPassword(password);
                if (user.passwordHash != passwordHash) {
                    return #err("Invalid password");
                };
                
                // Check if role matches
                if (user.role == role) {
                    // Create a response without sending the password hash
                    let safeUser = {
                        id = user.id;
                        role = user.role;
                        name = user.name;
                        email = user.email;
                        passwordHash = ""; // Don't send the hash to client
                        phoneNumber = user.phoneNumber;
                        idNumber = user.idNumber;
                        department = user.department;
                        barangay = user.barangay;
                        isActive = user.isActive;
                        createdAt = user.createdAt;
                    };
                    #ok(safeUser)
                } else {
                    #err("Invalid role")
                }
            };
        }
    };

    public func logoutUser(): async Result.Result<(), Text> {
        #ok(())
    };

    // Report Management
    public func submitReport(
        title: Text,
        description: Text,
        reportType: ReportType,
        location: Location,
        submittedBy: Text,
        mediaUrls: [Text],
        isAnonymous: Bool
    ): async Result.Result<Text, Text> {
        let reportId = generateId("report_", nextReportId);
        nextReportId += 1;

        let report: Report = {
            id = reportId;
            title = title;
            description = description;
            reportType = reportType;
            location = location;
            status = #Submitted;
            submittedBy = submittedBy;
            assignedTo = null;
            createdAt = Time.now();
            updatedAt = Time.now();
            mediaUrls = mediaUrls;
            isAnonymous = isAnonymous;
        };

        reports.put(reportId, report);
        #ok(reportId)
    };

    public func updateReportStatus(reportId: Text, newStatus: ReportStatus, _updatedBy: Text): async Result.Result<(), Text> {
        switch (reports.get(reportId)) {
            case null { #err("Report not found") };
            case (?report) {
                let updatedReport = {
                    report with
                    status = newStatus;
                    updatedAt = Time.now();
                };
                reports.put(reportId, updatedReport);
                #ok()
            };
        }
    };

    public func assignReport(reportId: Text, assignedTo: Text, _assignedBy: Text): async Result.Result<(), Text> {
        switch (reports.get(reportId)) {
            case null { #err("Report not found") };
            case (?report) {
                let updatedReport = {
                    report with
                    assignedTo = ?assignedTo;
                    status = #InProgress;
                    updatedAt = Time.now();
                };
                reports.put(reportId, updatedReport);
                #ok()
            };
        }
    };

    public query func getReport(reportId: Text): async ?Report {
        reports.get(reportId)
    };

    public query func getAllReports(): async [Report] {
        Iter.toArray(reports.vals())
    };

    public query func getReportsByBarangay(barangay: Text): async [Report] {
        let allReports = Iter.toArray(reports.vals());
        Array.filter(allReports, func(report: Report): Bool {
            report.location.barangay == barangay
        })
    };

    public query func getReportsByStatus(status: ReportStatus): async [Report] {
        let allReports = Iter.toArray(reports.vals());
        Array.filter(allReports, func(report: Report): Bool {
            report.status == status
        })
    };

    // Proposal Management
    public func createProposal(
        title: Text,
        description: Text,
        proposedBy: Text,
        barangay: Text,
        budget: Nat,
        deadline: Int
    ): async Result.Result<Text, Text> {
        let proposalId = generateId("proposal_", nextProposalId);
        nextProposalId += 1;

        let proposal: Proposal = {
            id = proposalId;
            title = title;
            description = description;
            proposedBy = proposedBy;
            barangay = barangay;
            budget = budget;
            status = #Pending;
            votes = [];
            createdAt = Time.now();
            deadline = deadline;
        };

        proposals.put(proposalId, proposal);
        #ok(proposalId)
    };

    public func voteOnProposal(proposalId: Text, userId: Text, vote: Bool): async Result.Result<(), Text> {
        switch (proposals.get(proposalId)) {
            case null { #err("Proposal not found") };
            case (?proposal) {
                let votesBuffer = Buffer.fromArray<(Text, Bool)>(proposal.votes);
                votesBuffer.add((userId, vote));
                let newVotes = Buffer.toArray(votesBuffer);
                let updatedProposal = {
                    proposal with
                    votes = newVotes;
                };
                proposals.put(proposalId, updatedProposal);
                #ok()
            };
        }
    };

    public query func getProposal(proposalId: Text): async ?Proposal {
        proposals.get(proposalId)
    };

    public query func getAllProposals(): async [Proposal] {
        Iter.toArray(proposals.vals())
    };

    public query func getProposalsByBarangay(barangay: Text): async [Proposal] {
        let allProposals = Iter.toArray(proposals.vals());
        Array.filter(allProposals, func(proposal: Proposal): Bool {
            proposal.barangay == barangay
        })
    };

    // Announcement Management
    public func createAnnouncement(
        title: Text,
        content: Text,
        author: Text,
        targetAudience: {#All; #Barangay: Text; #Police}
    ): async Result.Result<Text, Text> {
        let announcementId = generateId("announcement_", nextAnnouncementId);
        nextAnnouncementId += 1;

        let announcement: Announcement = {
            id = announcementId;
            title = title;
            content = content;
            author = author;
            targetAudience = targetAudience;
            createdAt = Time.now();
            isActive = true;
        };

        announcements.put(announcementId, announcement);
        #ok(announcementId)
    };

    public query func getAllAnnouncements(): async [Announcement] {
        let allAnnouncements = Iter.toArray(announcements.vals());
        Array.filter(allAnnouncements, func(announcement: Announcement): Bool {
            announcement.isActive
        })
    };

    public query func getAnnouncementsByTarget(target: {#All; #Barangay: Text; #Police}): async [Announcement] {
        let allAnnouncements = Iter.toArray(announcements.vals());
        Array.filter(allAnnouncements, func(announcement: Announcement): Bool {
            announcement.isActive and (announcement.targetAudience == target or announcement.targetAudience == #All)
        })
    };

    // Analytics
    public query func getReportStatsByBarangay(barangay: Text): async {
        total: Nat;
        submitted: Nat;
        inProgress: Nat;
        resolved: Nat;
    } {
        let barangayReports = Array.filter(Iter.toArray(reports.vals()), func(r: Report): Bool { r.location.barangay == barangay });
        let total = barangayReports.size();
        let submitted = Array.filter(barangayReports, func(r: Report): Bool { r.status == #Submitted }).size();
        let inProgress = Array.filter(barangayReports, func(r: Report): Bool { r.status == #InProgress }).size();
        let resolved = Array.filter(barangayReports, func(r: Report): Bool { r.status == #Resolved }).size();

        {
            total = total;
            submitted = submitted;
            inProgress = inProgress;
            resolved = resolved;
        }
    };

    // System info
    public query func getSystemInfo(): async {
        totalReports: Nat;
        totalUsers: Nat;
        totalProposals: Nat;
        totalAnnouncements: Nat;
    } {
        {
            totalReports = reports.size();
            totalUsers = users.size();
            totalProposals = proposals.size();
            totalAnnouncements = announcements.size();
        }
    };

    // Initialize test users
    public func initializeTestUsers() : async () {
        // Citizens
        ignore await registerUser(
            "John Doe",
            "john.doe@gmail.com",
            "password123",
            #Citizen,
            null,
            null,
            "09123456789",
            null
        );

        ignore await registerUser(
            "Jane Smith",
            "jane.smith@gmail.com",
            "password123",
            #Citizen,
            null,
            null,
            "09234567890",
            null
        );

        // Police Officials
        ignore await registerUser(
            "Mike Johnson",
            "mike.johnson@manilapd.gov.ph",
            "password123",
            #Police,
            ?"Manila Police District - Station 1 (Intramuros)",
            null,
            "09345678901",
            ?"MPD-12345"
        );

        ignore await registerUser(
            "Sarah Williams",
            "sarah.williams@manilapd.gov.ph",
            "password123",
            #Police,
            ?"Manila Police District - Station 2 (Ermita)",
            null,
            "09456789012",
            ?"MPD-12346"
        );

        // Barangay Officials
        ignore await registerUser(
            "Maria Santos",
            "maria.santos@barangay.gov.ph",
            "password123",
            #BarangayOfficial,
            null,
            ?"Ermita",
            "09567890123",
            ?"BRGY-12345"
        );

        ignore await registerUser(
            "Pedro Cruz",
            "pedro.cruz@barangay.gov.ph",
            "password123",
            #BarangayOfficial,
            null,
            ?"Intramuros",
            "09678901234",
            ?"BRGY-12346"
        );

        // Department Heads
        ignore await registerUser(
            "Robert Garcia",
            "robert.garcia@manilapd.gov.ph",
            "password123",
            #HeadPolice,
            ?"Manila Police District - Station 1 (Intramuros)",
            null,
            "09789012345",
            ?"MPD-12347"
        );

        ignore await registerUser(
            "Elena Reyes",
            "elena.reyes@barangay.gov.ph",
            "password123",
            #HeadBarangay,
            null,
            ?"Ermita",
            "09890123456",
            ?"BRGY-12347"
        );
    };

    // Call initializeTestUsers when the canister is deployed
    system func preupgrade() {
        // This runs before the canister code is upgraded
    };

    system func postupgrade() {
        // Cannot call async functions directly from system functions
        // We'll expose a public function that clients can call to initialize test users
    };

    // Initial setup - client needs to call this after deployment
    public func setup() : async () {
        await initializeTestUsers();
    };
}