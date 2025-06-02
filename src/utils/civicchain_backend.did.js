export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({
    'Citizen': IDL.Null,
    'Police': IDL.Null,
    'BarangayOfficial': IDL.Null,
    'HeadPolice': IDL.Null,
    'HeadBarangay': IDL.Null,
  });

  const User = IDL.Record({
    'id': IDL.Text,
    'name': IDL.Text,
    'email': IDL.Text,
    'role': UserRole,
    'department': IDL.Opt(IDL.Text),
    'barangay': IDL.Opt(IDL.Text),
  });

  const LoginResult = IDL.Variant({
    'Ok': User,
    'Err': IDL.Text,
  });

  const ReportStatus = IDL.Variant({
    'Submitted': IDL.Null,
    'UnderReview': IDL.Null,
    'InProgress': IDL.Null,
    'Resolved': IDL.Null,
    'Escalated': IDL.Null,
  });

  const ReportType = IDL.Variant({
    'Pothole': IDL.Null,
    'Theft': IDL.Null,
    'Corruption': IDL.Null,
    'TrafficViolation': IDL.Null,
    'NoiseComplaint': IDL.Null,
    'StreetLight': IDL.Null,
    'Garbage': IDL.Null,
  });

  const Report = IDL.Record({
    'id': IDL.Text,
    'title': IDL.Text,
    'description': IDL.Text,
    'location': IDL.Text,
    'type': ReportType,
    'status': ReportStatus,
    'reporterId': IDL.Text,
    'assignedTo': IDL.Opt(IDL.Text),
    'createdAt': IDL.Nat64,
    'updatedAt': IDL.Nat64,
  });

  const ReportResult = IDL.Variant({
    'Ok': Report,
    'Err': IDL.Text,
  });

  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Location = IDL.Record({
    'latitude' : IDL.Float64,
    'longitude' : IDL.Float64,
    'address' : IDL.Text,
    'barangay' : IDL.Text,
  });
  const Proposal = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Variant({
      'Rejected' : IDL.Null,
      'Pending' : IDL.Null,
      'Approved' : IDL.Null,
      'InProgress' : IDL.Null,
      'Completed' : IDL.Null,
    }),
    'title' : IDL.Text,
    'votes' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Bool)),
    'description' : IDL.Text,
    'budget' : IDL.Nat,
    'barangay' : IDL.Text,
    'deadline' : IDL.Int,
    'proposedBy' : IDL.Text,
    'createdAt' : IDL.Int,
  });
  const Announcement = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'author' : IDL.Text,
    'isActive' : IDL.Bool,
    'targetAudience' : IDL.Variant({
      'All' : IDL.Null,
      'Police' : IDL.Null,
      'Barangay' : IDL.Text,
    }),
    'createdAt' : IDL.Int,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'login': IDL.Func([IDL.Text, IDL.Text, UserRole], [LoginResult], ['query']),
    'registerUser': IDL.Func([IDL.Text, IDL.Text, UserRole, IDL.Vec(IDL.Text), IDL.Vec(IDL.Text)], [IDL.Variant({ 'ok': IDL.Text, 'err': IDL.Text })], []),
    'getUser': IDL.Func([IDL.Text], [IDL.Opt(User)], ['query']),
    'createReport': IDL.Func([IDL.Text, IDL.Text, IDL.Text, ReportType], [ReportResult], []),
    'getReport': IDL.Func([IDL.Text], [IDL.Opt(Report)], ['query']),
    'updateReportStatus': IDL.Func([IDL.Text, ReportStatus], [ReportResult], []),
    'assignReport': IDL.Func([IDL.Text, IDL.Text], [ReportResult], []),
    'getReportsByUser': IDL.Func([IDL.Text], [IDL.Vec(Report)], ['query']),
    'getReportsByStatus': IDL.Func([ReportStatus], [IDL.Vec(Report)], ['query']),
    'getReportsByType': IDL.Func([ReportType], [IDL.Vec(Report)], ['query']),
    'createAnnouncement' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Variant({
            'All' : IDL.Null,
            'Police' : IDL.Null,
            'Barangay' : IDL.Text,
          }),
        ],
        [Result],
        [],
      ),
    'createProposal' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Int],
        [Result],
        [],
      ),
    'getAllAnnouncements' : IDL.Func([], [IDL.Vec(Announcement)], ['query']),
    'getAllProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getAllReports' : IDL.Func([], [IDL.Vec(Report)], ['query']),
    'getAllUsers' : IDL.Func([], [IDL.Vec(User)], ['query']),
    'getAnnouncementsByTarget' : IDL.Func(
        [
          IDL.Variant({
            'All' : IDL.Null,
            'Police' : IDL.Null,
            'Barangay' : IDL.Text,
          }),
        ],
        [IDL.Vec(Announcement)],
        ['query'],
      ),
    'getManilaBarangays' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getPoliceStations' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getProposal' : IDL.Func([IDL.Text], [IDL.Opt(Proposal)], ['query']),
    'getProposalsByBarangay' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Proposal)],
        ['query'],
      ),
    'getReportStatsByBarangay' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'total' : IDL.Nat,
            'submitted' : IDL.Nat,
            'resolved' : IDL.Nat,
            'inProgress' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getReportsByBarangay' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Report)],
        ['query'],
      ),
    'getSystemInfo' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalReports' : IDL.Nat,
            'totalUsers' : IDL.Nat,
            'totalProposals' : IDL.Nat,
            'totalAnnouncements' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'submitReport' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          ReportType,
          Location,
          IDL.Text,
          IDL.Vec(IDL.Text),
          IDL.Bool,
        ],
        [Result],
        [],
      ),
    'voteOnProposal' : IDL.Func([IDL.Text, IDL.Text, IDL.Bool], [Result_1], []),
  });
};
export const init = ({ IDL }) => { return []; };