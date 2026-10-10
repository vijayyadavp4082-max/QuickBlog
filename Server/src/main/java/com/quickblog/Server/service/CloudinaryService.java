//package com.quickblog.Server.service;
//
//import com.cloudinary.Cloudinary;
//import com.cloudinary.utils.ObjectUtils;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.Map;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class CloudinaryService {
//
//    private final Cloudinary cloudinary;
//
//    public Map<String, Object> uploadImage(MultipartFile image) throws IOException {
//        if (image == null || image.isEmpty()) {
//            throw new IllegalArgumentException("Blog image is required");
//        }
//
//        String publicId = "quickblog/" + UUID.randomUUID();
//
//        return cloudinary.uploader().upload(
//                image.getBytes(),
//                ObjectUtils.asMap(
//                        "public_id", publicId,
//                        "resource_type", "image",
//                        "folder", "quickblog"
//                )
//        );
//    }
//
//    public void deleteImage(String publicId) throws IOException {
//        if (publicId == null || publicId.isBlank()) {
//            return;
//        }
//
//        cloudinary.uploader().destroy(
//                publicId,
//                ObjectUtils.asMap("resource_type", "image")
//        );
//    }
//}



package com.quickblog.Server.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;


    public Map<String, Object> uploadImage(MultipartFile image)
            throws IOException {

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException(
                    "Blog image is required"
            );
        }

        String publicId = UUID.randomUUID().toString();

        Map<String, Object> result =
                cloudinary.uploader().upload(
                        image.getBytes(),
                        ObjectUtils.asMap(
                                "public_id", publicId,
                                "folder", "quickblog",
                                "resource_type", "image"
                        )
                );

        return result;
    }

    // DELETE BLOG IMAGE FROM CLOUDINARY

    public void deleteImage(String publicId)
            throws IOException {

        if (publicId == null || publicId.isBlank()) {
            System.out.println(
                    "Cloudinary public ID is empty. Nothing to delete."
            );
            return;
        }

        System.out.println("Deleting Cloudinary image: " + publicId);

        Map<?, ?> result = cloudinary.uploader().destroy(
                        publicId,
                        ObjectUtils.asMap(
                                "resource_type", "image",
                                "type", "upload",
                                "invalidate", true
                        )
                );

        System.out.println("Cloudinary delete result: " + result);

        Object deleteResult = result.get("result");

        if ("ok".equals(deleteResult)) {

            System.out.println("Cloudinary image deleted successfully.");

        } else if ("not found".equals(deleteResult)) {

            System.out.println("Cloudinary image was not found: " + publicId);

        } else {

            System.out.println("Cloudinary delete response: " + result);
        }
    }
}