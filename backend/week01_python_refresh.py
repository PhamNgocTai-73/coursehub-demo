students = [
{"id": "22000001", "name": "Nguyen Minh Anh", "major": "KHDL"},
{"id": "22000002", "name": "Tran Duc Long", "major": "KHDL"},
]
courses = [
{
"code": "INT2204",
"name": "Co so du lieu Web va he thong thong tin",
"capacity": 3,
"enrolled": 2,
},
{
"code": "INT2205",
"name": "Khai pha du lieu",
"capacity": 2,
"enrolled": 2,
},
]
enrollments = [
{"student_id": "22000001", "course_code": "INT2204"}
]
for course in courses:
    remaining = course["capacity"] - course["enrolled"]
    print(course["code"], "- con", remaining, "cho")

def find_course(course_code):
    for course in courses:
        if course["code"] == course_code:
            return course
    return None
print(find_course("INT2204"))    

def can_enroll(student_id, course_code):
    course = find_course(course_code)
    if course is None:
        return False, "Hoc phan khong ton tai"
    if course["enrolled"] >= course["capacity"]:
        return False, "Lop da du so luong"
    duplicated = any(
        item["student_id"] == student_id and item["course_code"] == course_code
        for item in enrollments
    )

    if duplicated:
        return False, "Sinh vien da dang ky hoc phan nay"
    return True, "Co the dang ky"
print(can_enroll("22000002", "INT2204"))

try:
    limit = int(input("Nhap so luong hoc phan muon hien thi: "))
    print(courses[:limit])
except ValueError:
    print("So luong phai la so nguyen")

def search_courses(keyword):
    normalized = keyword.strip().lower()
    results = []
    for course in courses:
        code = course["code"].lower()
        name = course["name"].lower()
        if normalized in code or normalized in name:
            results.append(course)
    return results

print(search_courses("web"))    

def enroll_student(student_id, course_code):
    # 1. Kiểm tra sinh viên có tồn tại trong danh sách không
    student_exists = any(s["id"] == student_id for s in students)
    if not student_exists:
        return False, "Sinh vien khong ton tai"

    # 2. Kiểm tra các điều kiện đăng ký (Học phần tồn tại, còn chỗ, chưa đăng ký trùng)
    ok, message = can_enroll(student_id, course_code)
    if not ok:
        return False, message

    # 3. Tiến hành đăng ký thành công:
    # 3a. Thêm bản ghi mới vào danh sách enrollments
    enrollments.append({
        "student_id": student_id,
        "course_code": course_code
    })

    # 3b. Cập nhật số lượng enrolled của học phần
    course = find_course(course_code)
    course["enrolled"] += 1

    return True, "Dang ky thanh cong"

# --- BỘ KỊCH BẢN CHẠY THỬ (TEST CASES) ---
print("=== KẾT QUẢ THỰC HIỆN CÁC TÌNH HUỐNG CHẠY THỬ ===")

# Tình huống 1: Đăng ký thành công
# Sinh viên 22000002 đăng ký INT2204 (môn tồn tại, còn chỗ, chưa đăng ký)
status1, msg1 = enroll_student("22000002", "INT2204")
print(f"TH1 (Đăng ký thành công): Status = {status1} | Message = '{msg1}'")

# Tình huống 2: Đăng ký trùng
# Sinh viên 22000001 đăng ký lại INT2204 (đã đăng ký từ trước)
status2, msg2 = enroll_student("22000001", "INT2204")
print(f"TH2 (Đăng ký trùng): Status = {status2} | Message = '{msg2}'")

# Tình huống 3: Lớp đầy
# Sinh viên 22000001 đăng ký INT2205 (capacity=2, enrolled=2)
status3, msg3 = enroll_student("22000001", "INT2205")
print(f"TH3 (Lớp đầy): Status = {status3} | Message = '{msg3}'")

# Tình huống 4: Mã học phần không tồn tại
# Sinh viên 22000001 đăng ký INT9999
status4, msg4 = enroll_student("22000001", "INT9999")
print(f"TH4 (Mã môn không tồn tại): Status = {status4} | Message = '{msg4}'")

# Tình huống 5: Mã sinh viên không tồn tại
# Sinh viên 99999999 đăng ký INT2204
status5, msg5 = enroll_student("99999999", "INT2204")
print(f"TH5 (Mã SV không tồn tại): Status = {status5} | Message = '{msg5}'")

print("\n=== DỮ LIỆU SAU KHI CHẠY THỬ ===")
print("Danh sách enrollments:", enrollments)
print("Thông tin môn INT2204:", find_course("INT2204"))