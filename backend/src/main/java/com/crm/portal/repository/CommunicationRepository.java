package com.crm.portal.repository;

import com.crm.portal.entity.Communication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommunicationRepository extends JpaRepository<Communication, Long>, JpaSpecificationExecutor<Communication> {
}
