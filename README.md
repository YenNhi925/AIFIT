# AIFit – Trợ lý Thể hình Ứng dụng AI

**Hệ thống Phân tích và Hỗ trợ Chỉnh sửa Tư thế Tập luyện theo Thời gian thực**

AIFit là một ứng dụng web đóng vai trò "huấn luyện viên cá nhân ảo" chi phí thấp cho những người tập luyện một mình tại nhà. Hệ thống sử dụng webcam để theo dõi cơ thể người tập, phân tích tư thế theo thời gian thực và phát cảnh báo bằng giọng nói ngay khi phát hiện tư thế sai.

> Đồ án Capstone Project 1 (CMU-SE 450) – Nhóm C1SE.87, Trường Quốc tế, Đại học Duy Tân
> Thời gian thực hiện: 21/08/2026 – 06/12/2026 (12 tuần)

## Vấn đề

Tập luyện tại nhà ngày càng phổ biến, nhưng hầu hết mọi người tập mà không có ai quan sát và chỉnh sửa tư thế. Các lỗi thường gặp gồm lưng dưới bị cong và đầu gối cụp vào trong khi squat, hông võng xuống hoặc nhô cao khi plank, khuỷu tay mở quá rộng và hạ người chưa đủ sâu khi chống đẩy. Những lỗi này làm giảm hiệu quả tập luyện và gây áp lực lên cột sống, đầu gối và khớp vai. Chi phí thuê huấn luyện viên cá nhân lại là rào cản lớn với sinh viên và người có thu nhập trung bình.

## Giải pháp

AIFit không huấn luyện mô hình học sâu từ đầu. Hệ thống kết hợp Google MediaPipe Pose, một mô hình ước lượng tư thế đã hoàn thiện, với một lớp xử lý hình học vector do nhóm tự xây dựng:

```
Camera → MediaPipe Pose → Trích xuất khớp → Tính góc bằng vector
       → Đánh giá tư thế → Cảnh báo bằng giọng nói → Lưu kết quả → Thống kê tiến độ
```

MediaPipe trích xuất 33 điểm mốc trên cơ thể. Module của nhóm sau đó dùng công thức tích vô hướng (dot product) để tính góc khớp. Các góc này được so sánh với ngưỡng tham chiếu lưu trong cơ sở dữ liệu, dựa trên tài liệu cơ sinh học và khoa học thể thao. Từ đó hệ thống phân loại từng lần tập (rep) là đúng hay sai.

## Tính năng chính

- **Ba bài tập được hỗ trợ:** Squat, Plank và Push-up (chống đẩy).
- **Nhận diện tư thế thời gian thực:** hiển thị khung xương chồng lên video trực tiếp (HTML5 Canvas).
- **Phân tích tư thế:** tính góc khớp và phát hiện các lỗi kỹ thuật đã định nghĩa, như hông võng, hông nhô cao, squat chưa đủ sâu và khuỷu tay mở quá rộng.
- **Phản hồi bằng giọng nói:** nhắc sửa lỗi ngay lập tức qua Web Speech API, có cơ chế cooldown để tránh cảnh báo lặp liên tục.
- **Đếm rep tự động:** đếm số lần tập, phân loại đúng/sai và tính tỷ lệ chính xác.
- **Lịch sử và tiến độ tập luyện:** báo cáo từng buổi tập và biểu đồ thống kê cho mỗi người dùng.
- **Quản lý tài khoản:** đăng ký, đăng nhập và xác thực bằng JWT.
- **Công cụ quản trị:** quản lý người dùng, danh mục bài tập và điều chỉnh các thông số góc chuẩn mà không cần sửa mã nguồn lõi.

## Kiến trúc hệ thống

AIFit sử dụng kiến trúc lai **Edge-AI + Client-Server**.

| Tầng | Công nghệ | Trách nhiệm |
|---|---|---|
| Client (Edge-AI) | React.js, Tailwind CSS, MediaPipe Pose, Web Speech API, HTML5 Canvas | Nhận diện tư thế, tính góc, đánh giá tư thế, phản hồi bằng giọng nói và hình ảnh |
| Server | C# ASP.NET Core RESTful Web API | Xác thực JWT, cấu hình bài tập, lưu các buổi tập |
| Cơ sở dữ liệu | Microsoft SQL Server | Users, Exercises, ExerciseRules, WorkoutSessions, PostureErrors |

Toàn bộ quá trình xử lý video chạy ngay trên trình duyệt của người dùng thông qua WebAssembly và WebGL. Cách này loại bỏ độ trễ mạng và bảo vệ quyền riêng tư.

## Quyền riêng tư

Video và hình ảnh gốc **không bao giờ** được gửi lên hoặc lưu trên máy chủ. Các khung hình được xử lý trong bộ nhớ của trình duyệt và bị loại bỏ ngay sau khi trích xuất góc. Máy chủ chỉ lưu dữ liệu tổng hợp: số rep, tỷ lệ chính xác, thời lượng buổi tập và tên lỗi.

## Mục tiêu phi chức năng

- **Hiệu năng:** phân tích gần thời gian thực ở 20–30 FPS, độ trễ dưới 200 ms.
- **Bảo mật:** mật khẩu được mã hóa và xác thực bằng JWT.
- **Tính dễ dùng:** bắt đầu buổi tập chỉ với chưa đến 3 lần nhấp chuột.
- **Độ tin cậy:** xử lý được các tình huống như từ chối quyền camera, mất nhận diện cơ thể và mất kết nối mạng.
- **Tương thích:** các trình duyệt hiện đại hỗ trợ WebAssembly và WebGL (Chrome, Edge, Firefox, Safari).
- **Khả năng bảo trì:** lớp AI phía client tách biệt với lớp nghiệp vụ phía backend.

## Phạm vi và giới hạn

- Phiên bản này chỉ hỗ trợ 3 bài tập.
- Chỉ nhận diện một người trong mỗi khung hình.
- Cần webcam thông thường, ánh sáng tốt và góc đặt camera đúng hướng dẫn.
- Không phải công cụ y tế. Hệ thống không chẩn đoán bệnh và không thay thế bác sĩ hay chuyên gia phục hồi chức năng.
- Các ngưỡng góc là khoảng tham chiếu dựa trên bằng chứng nghiên cứu, không phải chuẩn tuyệt đối cho mọi dáng người. Chúng được tinh chỉnh trong quá trình kiểm thử.
- Ngoài phạm vi: ứng dụng di động native, cảm biến đeo (wearable/IoT) và các tính năng mạng xã hội/cộng đồng.

## Quy trình phát triển

Dự án áp dụng quy trình **Agile/Scrum**. Công việc được quản lý trên Jira và mã nguồn trên GitHub.

## Nhóm thực hiện

| Họ tên | Vai trò |
|---|---|
| Trần Thị Thanh Vinh | Scrum Master / Trưởng nhóm |
| Trần Thị Yến Nhi | Thành viên |
| Trần Thị Quỳnh Nga | Thành viên |
| Trần Thanh Hiếu | Thành viên |
| Trần Tuấn Mạnh | Thành viên |

**Giảng viên hướng dẫn:** Nguyễn Văn Vi
