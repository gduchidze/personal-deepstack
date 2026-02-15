# კვირა 1: micrograd და ნეირონული ქსელების საფუძვლები

## რას ვისწავლე

ამ კვირის განმავლობაში დავიწყე Andrej Karpathy-ს Zero to Hero სერია და ავაშენე **micrograd** - მინიმალური autograd engine ნულიდან.

### ძირითადი კონცეფციები:

- ✅ **Autograd**: ავტომატური დიფერენცირება
- ✅ **Computation Graph**: გამოთვლების გრაფი
- ✅ **Backpropagation**: უკუგავრცელება
- ✅ **Gradient Descent**: გრადიენტული დაშვება

## პრაქტიკული ნამუშევარი

```python
class Value:
    def __init__(self, data):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None

    def backward(self):
        # Topological sort
        topo = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                topo.append(v)
        build_topo(self)

        # Backward pass
        self.grad = 1.0
        for node in reversed(topo):
            node._backward()
```

## DSA პრაქტიკა

ამ კვირას გადავწყვიტე **10 პრობლემა** NeetCode-დან:

1. Contains Duplicate ✓
2. Valid Anagram ✓
3. Two Sum ✓
4. Group Anagrams ✓
5. Top K Frequent Elements ✓

## რა გამიჭირდა

- გრადიენტების მექანიკის სრულად გააზრება
- Computation graph-ის ვიზუალიზაცია
- Backpropagation-ის დაბაგვა

## შემდეგი ნაბიჯები

კვირა 2: **makemore** - character-level language model

---

*თარიღი: Feb 16, 2026*
*სტატუსი: Week 1 დასრულებული ✓*
