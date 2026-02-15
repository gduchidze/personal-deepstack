# DSA პრობლემების გადაჭრის სტრატეგიები

## შესავალი

Data Structures and Algorithms (DSA) არის ტექნიკური ინტერვიუს ხერხემალი. აქ არის ჩემი პირადი სტრატეგიები და patterns.

## ძირითადი მიდგომა: UMPIRE Framework

```
U - Understand
M - Match
P - Plan
I - Implement
R - Review
E - Evaluate
```

### 1. Understand (გაგება)
- წაიკითხე პრობლემა 2-3-ჯერ
- დაწერე input/output მაგალითები
- გამოყავი edge cases
- დაადასტურე constrains

### 2. Match (შესატყვისება)
- რომელი pattern შეესაბამება?
  - Two Pointers
  - Sliding Window
  - Fast & Slow Pointers
  - Binary Search
  - BFS/DFS
  - Dynamic Programming

### 3. Plan (გეგმა)
- დაწერე pseudo-code
- ახსენი approach interviewer-ს
- განსაზღვრე time/space complexity

### 4. Implement (იმპლემენტაცია)
- დაწერე clean code
- გამოიყენე meaningful variable names
- კომენტარები complex logic-ზე

### 5. Review (გადახედვა)
- გაიარე code line-by-line
- შეამოწმე edge cases
- refactor თუ შესაძლებელია

### 6. Evaluate (შეფასება)
- Time Complexity
- Space Complexity
- Alternative approaches

## Common Patterns

### Pattern 1: Two Pointers

```python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1

    while left < right:
        current_sum = arr[left] + arr[right]

        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return []
```

**გამოსაყენებელია:**
- Sorted arrays
- Pair problems
- Palindrome checking

### Pattern 2: Sliding Window

```python
def max_sum_subarray(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum

    for i in range(len(arr) - k):
        window_sum = window_sum - arr[i] + arr[i + k]
        max_sum = max(max_sum, window_sum)

    return max_sum
```

**გამოსაყენებელია:**
- Subarray/substring problems
- Fixed window size
- Max/Min in range

### Pattern 3: Fast & Slow Pointers

```python
def has_cycle(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            return True

    return False
```

**გამოსაყენებელია:**
- Cycle detection
- Middle of linked list
- Palindrome linked list

## ჩემი სწავლის გრაფიკი

### ყოველდღიური მიზნები:
- 🎯 დილით 1 easy/medium problem
- 🎯 საღამოს 1 medium/hard problem
- 🎯 კვირაში 2-3 hard problem

### კვირეული მიზნები:
- ✅ 10-15 problems solved
- ✅ 2-3 new patterns learned
- ✅ Review and refactor old solutions

## რჩევები

1. **არ დაიწყო coding-ით** - ჯერ გააანალიზე პრობლემა
2. **Test cases-ის წერა** - ყოველთვის ჯერ test cases
3. **Time Complexity ჯერ** - ოპტიმიზაცია შემდეგ
4. **Communication** - speak your thought process
5. **Practice Daily** - consistency is key

## NeetCode 150 პროგრესი

### Arrays & Hashing (9/9)
- ✅ Contains Duplicate
- ✅ Valid Anagram
- ✅ Two Sum
- ✅ Group Anagrams
- ✅ Top K Frequent
- ✅ Product Except Self
- ✅ Valid Sudoku
- ✅ Encode/Decode Strings
- ✅ Longest Consecutive

### Two Pointers (5/5)
- ✅ Valid Palindrome
- ✅ Two Sum II
- ✅ 3Sum
- ✅ Container With Most Water
- ✅ Trapping Rain Water

### Sliding Window (0/6)
- ⏳ Best Time to Buy/Sell
- ⏳ Longest Substring
- ⏳ Longest Repeating Character
- ⏳ Permutation in String
- ⏳ Minimum Window
- ⏳ Sliding Window Maximum

## დასკვნა

DSA არის skill რომელიც ვითარდება დროთა განმავლობაში.
ყოველი გადაჭრილი პრობლემა გაძლიერებს.

**Remember:** Every expert was once a beginner!

---

*განახლების თარიღი: Feb 16, 2026*
*გადაჭრილი პრობლემები: 10/500*
