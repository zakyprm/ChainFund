// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title ChainFund
/// @notice Platform donasi sederhana: buat kampanye, donasi ETH, tarik dana
///         setelah target tercapai (Opsi A). Deadline belum didukung di versi ini.
contract ChainFund {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 goal; // target dalam wei
        uint256 totalRaised; // total terkumpul dalam wei
        bool withdrawn; // true kalau dana sudah ditarik
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    Campaign[] private campaigns;
    // campaignId => riwayat donasi
    mapping(uint256 => Donation[]) private donations;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        string title,
        uint256 goal
    );
    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );
    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 amount
    );

    error EmptyTitle();
    error ZeroGoal();
    error CampaignNotFound(uint256 campaignId);
    error ZeroDonation();
    error NotCampaignOwner();
    error GoalNotReached();
    error AlreadyWithdrawn();
    error TransferFailed();

    modifier campaignExists(uint256 campaignId) {
        if (campaignId >= campaigns.length) revert CampaignNotFound(campaignId);
        _;
    }

    /// @notice Buat kampanye baru. Pemanggil menjadi owner.
    /// @return campaignId id kampanye (index di array, mulai dari 0)
    function createCampaign(
        string calldata title,
        string calldata description,
        uint256 goal
    ) external returns (uint256 campaignId) {
        if (bytes(title).length == 0) revert EmptyTitle();
        if (goal == 0) revert ZeroGoal();

        campaignId = campaigns.length;
        campaigns.push(
            Campaign({
                owner: msg.sender,
                title: title,
                description: description,
                goal: goal,
                totalRaised: 0,
                withdrawn: false
            })
        );

        emit CampaignCreated(campaignId, msg.sender, title, goal);
    }

    /// @notice Donasi ETH ke kampanye.
    function donate(uint256 campaignId)
        external
        payable
        campaignExists(campaignId)
    {
        if (msg.value == 0) revert ZeroDonation();

        campaigns[campaignId].totalRaised += msg.value;
        donations[campaignId].push(
            Donation({
                donor: msg.sender,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );

        emit DonationReceived(campaignId, msg.sender, msg.value);
    }

    /// @notice Tarik seluruh dana kampanye. Hanya owner, hanya setelah target
    ///         tercapai, dan hanya sekali.
    function withdraw(uint256 campaignId) external campaignExists(campaignId) {
        Campaign storage c = campaigns[campaignId];

        if (msg.sender != c.owner) revert NotCampaignOwner();
        if (c.withdrawn) revert AlreadyWithdrawn();
        if (c.totalRaised < c.goal) revert GoalNotReached();

        // Effects dulu sebelum interaksi eksternal (cegah reentrancy).
        c.withdrawn = true;
        uint256 amount = c.totalRaised;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit FundsWithdrawn(campaignId, msg.sender, amount);
    }

    /// @notice Jumlah seluruh kampanye.
    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }

    /// @notice Detail satu kampanye.
    function getCampaign(uint256 campaignId)
        external
        view
        campaignExists(campaignId)
        returns (Campaign memory)
    {
        return campaigns[campaignId];
    }

    /// @notice Riwayat donasi satu kampanye.
    function getDonations(uint256 campaignId)
        external
        view
        campaignExists(campaignId)
        returns (Donation[] memory)
    {
        return donations[campaignId];
    }
}
