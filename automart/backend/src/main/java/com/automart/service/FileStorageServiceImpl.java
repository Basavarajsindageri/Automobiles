package com.automart.service;

import com.automart.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageServiceImpl() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create directory for uploaded files.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String extension = "";
        int i = originalFileName.lastIndexOf('.');
        if (i > 0) {
            extension = originalFileName.substring(i).toLowerCase();
        }

        if (!extension.equals(".jpg") && !extension.equals(".jpeg") && !extension.equals(".png") && !extension.equals(".webp")) {
            throw new BadRequestException("Only JPG, PNG, and WEBP images are supported.");
        }

        String fileName = UUID.randomUUID().toString() + extension;

        try {
            if (fileName.contains("..")) {
                throw new BadRequestException("Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/uploads/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
}
